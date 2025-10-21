import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FacilitiesCombobox } from "./userField/FacilitiesCombobox"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { LosSlider } from "./userField/losSlider"
import { AgeSlider } from "./userField/AgeSlider"
import { ReviewOutcomeCheckbox } from "./userField/ReviewOutcomeCheckbox"
import { StableCheckbox } from "./userField/StableCheckbox"
import { RNCombobox } from "./userField/RNCombobox"
import { MTTCombobox } from "./userField/MTTCombobox"
import { AnticipatedDispoCheckbox } from "./userField/AnticipatedDispoCheckbox"
export function UserFiltersField() {
    return (
        <div className="w-full">
            <>
                <FieldGroup className="">
                    <FieldSet>
                        {/* Combobox Filters */}
                        <FieldGroup className="grid grid-cols-4">
                            <Field>
                                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                    Facility
                                </FieldLabel>
                                <FacilitiesCombobox />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                                    RN Select
                                </FieldLabel>
                                <RNCombobox />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="checkout-exp-month-ts6">
                                    MTT
                                </FieldLabel>
                                <MTTCombobox />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="checkout-exp-month-ts6">
                                    Medical Home
                                </FieldLabel>
                                <MTTCombobox />
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSeparator />
                    {/* Checkbox Filters */}
                    <FieldSet className="grid grid-cols-3">
                        <FieldGroup>
                            <ReviewOutcomeCheckbox />
                        </FieldGroup>
                        <FieldGroup>
                            <StableCheckbox />
                        </FieldGroup>
                        <FieldGroup>
                            <AnticipatedDispoCheckbox />
                        </FieldGroup>
                    </FieldSet>
                    <Field orientation="horizontal">
                        <Button type="submit">Submit</Button>
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                    </Field>
                </FieldGroup>
            </>
        </div>
    )
}
