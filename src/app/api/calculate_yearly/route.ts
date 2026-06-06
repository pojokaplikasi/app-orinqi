import { NextResponse } from 'next/server';
import dayjs from 'dayjs';
import { calculateYearlyPillars } from '@/lib/bazi';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const startYear = parseInt(data.start_year);
        const endYear = parseInt(data.end_year);
        const birthTimeStr = data.birth_time;
        
        const birthTime = dayjs(birthTimeStr.replace('Z', '+00:00'));
        
        const yearlyPillars = calculateYearlyPillars(startYear, endYear, birthTime);
        
        return NextResponse.json({ yearly_pillars: yearlyPillars });
        
    } catch (error: any) {
        console.error("Error in calculate_yearly:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
