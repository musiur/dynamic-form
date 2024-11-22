import { Info } from "lucide-react"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"


const TooltipX = ({ content }: { content: string }) => {
    return <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Info className="w-4 h-4" />
            </TooltipTrigger>

            <TooltipContent>{content}</TooltipContent>
        </Tooltip>

    </TooltipProvider>
}

export default TooltipX;