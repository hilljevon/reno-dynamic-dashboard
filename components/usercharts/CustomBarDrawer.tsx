"use client"

import { BarClickInterface } from "@/controllers/interfaces"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { CasesTable } from "../datatable/CasesTable"
interface BarDrawerInterface {
    isDrawerOpen: boolean,
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>,
    selectedBarData: BarClickInterface | null
}
// Custom bar for shadcn barchart that renders a drawer upon click
const CustomBarDrawer = ({ isDrawerOpen, setIsDrawerOpen, selectedBarData }: BarDrawerInterface) => {
    if (!selectedBarData) return null
    return (
        <>
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent
                    className="max-h-[90vh] h-[90vh] p-8 overflow-hidden will-change-auto transform-none"
                >
                    <div className="flex flex-col h-full w-full">
                        <DrawerHeader>
                            <DrawerTitle className="text-lg font-semibold text-gray-900">
                                {selectedBarData?.nameKey}
                            </DrawerTitle>
                            <DrawerDescription>
                                {selectedBarData?.dataKey} Cases
                            </DrawerDescription>
                        </DrawerHeader>

                        {selectedBarData && (
                            <div className="flex-1 overflow-auto">
                                {selectedBarData.fullData && (
                                    <CasesTable data={selectedBarData.fullData} />
                                )}
                            </div>
                        )}
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default CustomBarDrawer