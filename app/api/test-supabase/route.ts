import { createClient } from '@/lib/database/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test basic connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection working',
      data: data
    })
    
  } catch (err) {
    return NextResponse.json({ 
      success: false, 
      error: 'Connection failed',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
}
