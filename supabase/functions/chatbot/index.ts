
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, history = [] } = await req.json();
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY') || 'AIzaSyAD7O8MSdrF7hr58VtHzkO0EdxKLwKQbsQ';
    const googleMapsApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');

    // Enhanced location detection with more comprehensive regex
    const locationMatches = query.match(/near\s+([^?.,]+)|in\s+([^?.,]+)|at\s+([^?.,]+)|around\s+([^?.,]+)|located\s+in\s+([^?.,]+)/i);
    let locationContext = "";

    // If location is mentioned and Google Maps API key is available
    if (locationMatches && googleMapsApiKey) {
      // Find the first non-undefined group (the actual location)
      const location = locationMatches.slice(1).find(match => match !== undefined);
      
      if (location) {
        try {
          // Use Google Maps Places API to get detailed location info
          const placesResponse = await fetch(
            `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(location)}&inputtype=textquery&fields=name,formatted_address,type&key=${googleMapsApiKey}`
          );
          
          const placesData = await placesResponse.json();
          
          if (placesData.candidates && placesData.candidates.length > 0) {
            const place = placesData.candidates[0];
            locationContext = `The query is about ${place.name}, located at ${place.formatted_address}. 
            Place type: ${place.types ? place.types.join(', ') : 'Not specified'}. `;
            console.log("Detailed location context:", locationContext);
          }
        } catch (mapError) {
          console.error("Error fetching location data:", mapError);
        }
      }
    }

    // Format the system message
    let systemMessage = `You are Lovable, a friendly and knowledgeable AI chatbot for FreelanceHub, a platform connecting clients with freelancers. ${locationContext}
    
    Common FAQs:
    1. How do I create an account? - You can create an account by clicking on the "Sign Up" button in the top right corner of the homepage and filling out the registration form.
    2. How do I post a project? - After logging in, click on the "Post a Project" button in the navigation menu and fill in the project details form.
    3. What are the fees? - FreelanceHub charges a 10% fee on all completed projects.
    4. How does payment work? - Clients fund projects upfront into a secure escrow, and funds are released to freelancers once the work is approved.
    5. How does the dynamic pricing system work? - Our AI analyzes market rates and adjusts project prices based on demand, skills required, and timeline to ensure fair pricing.
    
    Be warm, human-like, and helpful in your responses - like a helpful friend. Keep explanations clear, engaging, and easy to understand.`;

    // Format the conversation for Gemini API
    const formattedHistory = history.map(msg => msg.content).join("\n");
    
    // Prepare request for Gemini API
    const geminiRequest = {
      contents: [{
        parts: [{
          text: `${systemMessage}\n\nConversation history:\n${formattedHistory}\n\nUser query: ${query}`
        }]
      }]
    };

    // Call Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': geminiApiKey,
      },
      body: JSON.stringify(geminiRequest),
    });

    const data = await response.json();
    
    // Extract the answer from Gemini response
    let answer = "";
    if (data.candidates && data.candidates.length > 0 && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts.length > 0) {
      answer = data.candidates[0].content.parts[0].text;
    } else if (data.promptFeedback && data.promptFeedback.blockReason) {
      answer = `I'm sorry, but I couldn't process that request because: ${data.promptFeedback.blockReason}`;
    } else {
      answer = "I'm sorry, I encountered an issue generating a response. Please try again.";
    }

    // Return the assistant's response with location context flag
    return new Response(JSON.stringify({
      answer: answer,
      locationDetected: !!locationContext
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

