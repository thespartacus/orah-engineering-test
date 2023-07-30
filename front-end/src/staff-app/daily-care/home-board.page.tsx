import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing } from "shared/styles/styles"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { RolllStateType } from "shared/models/roll"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { Toolbar, ToolbarAction, SortOrder, SortBy } from "staff-app/components/tool-bar/tool-bar.component"
import { useSearch } from "shared/hooks/use-search"
import { useSort } from "shared/hooks/use-sort"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [studentsData, setStudentsData] = useState<Person[]>([])
  const [isFilterView, setIsFilterView] = useState(false)
  const [filterType, setFilterType] = useState<string>("unmark")
  const [state, dispatch, callApi] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [saveRollState, dispatchRollState, callApiSaveRoll] = useApi<{ students: Person[] }>({ url: "save-roll" })
  const studentData = state?.data?.students || [];
  const loadState = state?.loadState
  const [searchTerm, setSearchTerm, searchResults] = useSearch({ data: studentData || [] })
  const [setSortBy, setSortOrder, sortedResults] = useSort({ data: studentData || [], sortByParam: "first_name", sortOrderParam: "asc" })

  useEffect(() => {
    void callApi()
  }, [callApi])

  useEffect(() => {
    setStudentsData(studentData || [])
  }, [studentData])

  useEffect(() => {
    if (searchResults) {
      setStudentsData(searchResults || [])
    }
  }, [searchResults])

  useEffect(() => {
    if (sortedResults) {
      setStudentsData(sortedResults || [])
    }
  }, [sortedResults])

  const onToolbarAction = (action: ToolbarAction, value?: string) => {
    if (action === "roll") {
      setIsRollMode(true)
    }

    if (action === "sort") {
      if (value) {
        const [newSortBy, newSortOrder] = value.split(":") as [SortBy, SortOrder]
        setSortBy(newSortBy)
        setSortOrder(newSortOrder)
      }
    }

    if (action === "search") {
      setSearchTerm(value || "")
    }
  }

  const onActiveRollAction = (action: ActiveRollAction, type?: string) => {
    if (action === "exit") {
      setIsRollMode(false)
      isFilterView && setIsFilterView(false)
      isFilterView && setFilterType("unmark")

      // save roll data
      let saveRollStudents = {
        student_roll_states: studentsData.map((s) => {
          return {
            student_id: s.id,
            roll_state: s.roll_state || "unmark",
          }
        })
      }
      callApiSaveRoll(saveRollStudents || [])

      // clear roll data
      let newStudents = [...studentsData]
      newStudents = newStudents.map((s) => {
        s.roll_state = "unmark"
        return s
      })
      setStudentsData(newStudents || [])
    }

    if (action === "filter") {
      setIsFilterView(true)
      setFilterType(type as RolllStateType)
    }
  }

  const onStateChange = (newState: RolllStateType, id: number) => {
    const newStudents = [...studentsData]
    const index = newStudents.findIndex((s) => s.id === id)
    if (index > -1) {
      newStudents[index].roll_state = newState
      setStudentsData(newStudents)
    }
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && studentsData && (
          <>
            {
              studentsData.map((s) => {
                if (isFilterView) {
                  if (filterType === "all") {
                    return <StudentListTile key={s.id} isRollMode={isRollMode} student={s} onStateChange={onStateChange} />
                  } else {
                    if (s.roll_state === filterType) {
                      return <StudentListTile key={s.id} isRollMode={isRollMode} student={s} onStateChange={onStateChange} />
                    }
                  }

                } else {
                  return <StudentListTile key={s.id} isRollMode={isRollMode} student={s} onStateChange={onStateChange} />
                }

              })
            }
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} studentsData={studentsData} />
    </>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
}
