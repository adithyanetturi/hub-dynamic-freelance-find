
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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const googleMapsApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    // Extract location references from the query
    const locationMatches = query.match(/near\s+([^?.,]+)|in\s+([^?.,]+)|at\s+([^?.,]+)|around\s+([^?.,]+)/i);
    let locationContext = "";

    // If location is mentioned, use Google Maps API to get information
    if (locationMatches && googleMapsApiKey) {
      // Find the first non-undefined group (the actual location)
      const location = locationMatches.slice(1).find(match => match !== undefined);
      
      if (location) {
        try {
          // Use Google Maps Places API to get location info
          const placesResponse = await fetch(
            `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(location)}&inputtype=textquery&fields=name,formatted_address&key=${googleMapsApiKey}`
          );
          
          const placesData = await placesResponse.json();
          
          if (placesData.candidates && placesData.candidates.length > 0) {
            const place = placesData.candidates[0];
            locationContext = `The user is asking about ${place.name}, located at ${place.formatted_address}. `;
            console.log("Location context added:", locationContext);
          }
        } catch (mapError) {
          console.error("Error fetching location data:", mapError);
        }
      }
    }

    // Prepare the messages including context about the site
    const messages = [
      {
        role: "system",
        content: `You are a helpful assistant for FreelanceHub, a platform connecting clients with freelancers. 
        ${locationContext}
        
        Common FAQs:
        1. How do I create an account? - You can create an account by clicking on the "Sign Up" button in the top right corner of the homepage and filling out the registration form.
        2. How do I post a project? - After logging in, click on the "Post a Project" button in the navigation menu and fill in the project details form.
        3. What are the fees? - FreelanceHub charges a 10% fee on all completed projects.
        4. How does payment work? - Clients fund projects upfront into a secure escrow, and funds are released to freelancers once the work is approved.
        5. How does the dynamic pricing system work? - Our AI analyzes market rates and adjusts project prices based on demand, skills required, and timeline to ensure fair pricing.
        6. What happens if I'm not satisfied with the work? - We offer a dispute resolution process where a mediator will review the case and make a determination.
        7. Can I hire a team of freelancers? - Yes, you can hire multiple freelancers or look for agencies that provide team-based solutions.
        8. How do I communicate with freelancers? - After accepting a proposal, you'll gain access to our messaging system to communicate directly with the freelancer.
        
        Keep your answers concise, friendly and helpful.`
      },
      ...history,
      { role: "user", content: query }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    // Return the assistant's response
    return new Response(JSON.stringify({
      answer: data.choices[0].message.content,
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
