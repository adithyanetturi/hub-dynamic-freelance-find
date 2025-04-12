
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { categories, locations } from "@/data/dummyData";

interface SearchFiltersProps {
  onSearch: (filters: {
    query: string;
    category: string;
    location: string;
    budget: number[];
  }) => void;
}

const SearchFilters = ({ onSearch }: SearchFiltersProps) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("All Locations");
  const [budget, setBudget] = useState([0, 5000]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      query,
      category,
      location,
      budget,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSearch}>
        <div className="space-y-4">
          {/* Search input */}
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search projects..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </div>

          {/* Filter options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category filter */}
            <div>
              <Label htmlFor="category" className="mb-1 block">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location filter */}
            <div>
              <Label htmlFor="location" className="mb-1 block">Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Budget filter */}
            <div>
              <div className="flex justify-between mb-1">
                <Label htmlFor="budget">Budget</Label>
                <span className="text-sm text-gray-500">
                  ${budget[0]} - ${budget[1]}
                </span>
              </div>
              <Slider
                id="budget"
                min={0}
                max={5000}
                step={100}
                value={budget}
                onValueChange={setBudget}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchFilters;
