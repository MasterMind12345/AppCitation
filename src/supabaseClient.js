import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://faishpithcpospzpbmxj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhaXNocGl0aGNwb3NwenBibXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTk1NzEsImV4cCI6MjA3NzU5NTU3MX0.QpbNdfda6sD5V8uvTp-YtALU6AlZL1llvVantC5Nh_Y'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)