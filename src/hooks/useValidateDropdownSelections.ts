import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

export const useValidateDropdownSelections = (
  fieldName: string,
  selectedValues: string[],
  availableOptions: string[] | undefined
) => {
  const { setValue } = useFormContext()

  useEffect(() => {
    if (
      !availableOptions ||
      !Array.isArray(selectedValues) ||
      selectedValues.length === 0
    ) {
      return
    }

    const validValues = selectedValues.filter((val) =>
      availableOptions.includes(val)
    )

    // Only update if something was filtered out
    if (validValues.length !== selectedValues.length) {
      setValue(fieldName, validValues, {
        shouldDirty: true,
        shouldValidate: true
      })
    }
  }, [fieldName, selectedValues, availableOptions, setValue])
}
