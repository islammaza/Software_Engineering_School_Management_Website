import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://qyhhdykrsmhqujrjmnle.supabase.co", 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5aGhkeWtyc21ocXVqcmptbmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NjU3NzgsImV4cCI6MjA3OTM0MTc3OH0.lpztKYvHgBuq-3prlxBjDAF-CZwvamvYt-m5qEIGFA8"
);  