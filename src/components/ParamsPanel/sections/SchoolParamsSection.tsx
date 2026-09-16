import { useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'

import { Stack } from '@mui/material'

import { useLocationsSelectOptions } from 'providers/LocationsSelectOptionsProvider'
import { useSearch } from 'providers/SearchProvider'
import { useValidateDropdownSelections } from 'hooks/useValidateDropdownSelections'

import { ParamsMultiSelect } from '../components'

import SectionTemplate from './SectionTemplate'

const SchoolParamsSection = () => {
  const { params } = useSearch()
  const { options, loading } = useLocationsSelectOptions()
  const { watch, setValue } = useFormContext()
  const schoolType = watch('schoolType')
  const schoolLevel = watch('schoolLevel')
  const privateSchoolAffiliation = watch('privateSchoolAffiliation')
  const schoolDistrictName = watch('schoolDistrictName')
  const locationsSourceFormValue = watch('locationsSource')

  // Validate and clear selections that no longer exist in available options
  useValidateDropdownSelections('schoolType', schoolType, options?.schoolType)
  useValidateDropdownSelections(
    'schoolLevel',
    schoolLevel,
    options?.schoolLevel
  )
  useValidateDropdownSelections(
    'privateSchoolAffiliation',
    privateSchoolAffiliation,
    options?.privateSchoolAffiliation
  )
  useValidateDropdownSelections(
    'schoolDistrictName',
    schoolDistrictName,
    options?.schoolDistrictName
  )

  // Clear school fields when source changes
  const prevSourceFormRef = useRef<string[]>([])

  useEffect(() => {
    const currentSource = locationsSourceFormValue || []
    const prevSource = prevSourceFormRef.current

    // Check if source actually changed in form (not on initial load)
    const sourceChanged =
      JSON.stringify(currentSource) !== JSON.stringify(prevSource)

    if (sourceChanged && prevSource.length > 0) {
      // Source was changed by user, clear school-related fields
      // ParamsMultiSelect already submitted the form with new source
      setValue('schoolType', [], {
        shouldDirty: true,
        shouldValidate: true
      })
      setValue('schoolLevel', [], {
        shouldDirty: true,
        shouldValidate: true
      })
      setValue('privateSchoolAffiliation', [], {
        shouldDirty: true,
        shouldValidate: true
      })
      setValue('schoolDistrictName', [], {
        shouldDirty: true,
        shouldValidate: true
      })
    }

    prevSourceFormRef.current = currentSource
  }, [locationsSourceFormValue, setValue])

  if (params.endpoint !== 'locations') return null

  return (
    <SectionTemplate
      index={14}
      title="School Params"
      tooltip="Acceptable values come from the /locations aggregates endpoint"
    >
      <Stack spacing={1.25}>
        <ParamsMultiSelect
          name="schoolType"
          options={options?.schoolType}
          loading={loading}
          tooltip="Filter locations type=school by school type"
        />
        <ParamsMultiSelect
          name="schoolLevel"
          options={options?.schoolLevel}
          loading={loading}
          tooltip="Filter locations type=school by level"
        />
        <ParamsMultiSelect
          name="privateSchoolAffiliation"
          options={options?.privateSchoolAffiliation}
          loading={loading}
          tooltip="Filter locations type=school by private school affiliation"
        />
        <ParamsMultiSelect
          name="schoolDistrictName"
          options={options?.schoolDistrictName}
          loading={loading}
          tooltip="Filter locations type=school by school district name"
        />
      </Stack>
    </SectionTemplate>
  )
}

export default SchoolParamsSection
