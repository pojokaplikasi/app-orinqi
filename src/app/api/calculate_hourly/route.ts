import { NextResponse } from 'next/server';
import dayjs from 'dayjs';
import { calculateHourlyPillars } from '@/lib/bazi';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const year = parseInt(data.year);
        const month = parseInt(data.month);
        const day = parseInt(data.day);
        const birthTimeStr = data.birth_time;
        
        const birthTime = dayjs(birthTimeStr.replace('Z', '+00:00'));
        
        const hourlyPillars = calculateHourlyPillars(year, month, day, birthTime);
        
        return NextResponse.json({ hourly_pillars: hourlyPillars });
        
    } catch (error: any) {
        console.error("Error in calculate_hourly:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
