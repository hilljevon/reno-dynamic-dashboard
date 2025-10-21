"use client"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

type SliderProps = React.ComponentProps<typeof Slider>

export function AgeSlider({ className, ...props }: SliderProps) {
    const [los, setLos] = useState(5)

    return (
        <div className={cn("flex flex-col items-center", className)}>
            <Slider
                value={[los]}
                onValueChange={(val) => setLos(val[0])}
                max={80}
                step={1}
                className="w-[60%]"
                {...props}
            />
            <span className="mt-2 text-sm text-gray-700">
                Age: {los} years old
            </span>
        </div>
    )
}
