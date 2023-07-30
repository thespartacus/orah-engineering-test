import React, { useEffect } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
import { Spacing, FontWeight } from "shared/styles/styles"
import { RolllStateType } from "shared/models/roll"
import { Person } from "shared/models/person"


interface Props {
  stateList: StateList[]
  onItemClick?: (type: ItemType) => void
  size?: number
  studentsData: Person[]
  updateStateListState: React.Dispatch<React.SetStateAction<StateList[]>>
}
export const RollStateList: React.FC<Props> = ({ stateList, size = 14, onItemClick, studentsData, updateStateListState }) => {
  const onClick = (type: ItemType) => {
    if (onItemClick) {
      onItemClick(type)
    }
  }

  useEffect(() => {
    const newStateList = updateStateList(studentsData, stateList)
    updateStateListState(newStateList)
  }, [studentsData])

  const updateStateList = (studentData: Person[], stateList: StateList[]) => {
    const newStateList = [...stateList]

    newStateList.forEach((state) => {
      state.count = 0

      if (state.type === "all") {
        state.count = studentData.length
      }

      if (state.type === "present") {
        state.count = studentData.filter((student) => student.roll_state === "present").length
      }

      if (state.type === "late") {
        state.count = studentData.filter((student) => student.roll_state === "late").length
      }

      if (state.type === "absent") {
        state.count = studentData.filter((student) => student.roll_state === "absent").length
      }
    })
  
    return newStateList
  }

  return (
    <S.ListContainer>
      {stateList.map((s, i) => {
        if (s.type === "all") {
          return (
            <S.ListItem key={i}>
              <FontAwesomeIcon icon="users" size="sm" style={{ cursor: "pointer" }} onClick={() => onClick(s.type)} />
              <span>{s.count}</span>
            </S.ListItem>
          )
        }

        return (
          <S.ListItem key={i}>
            <RollStateIcon type={s.type} size={size} onClick={() => onClick(s.type)} />
            <span>{s.count}</span>
          </S.ListItem>
        )
      })}
    </S.ListContainer>
  )
}

const S = {
  ListContainer: styled.div`
    display: flex;
    align-items: center;
  `,
  ListItem: styled.div`
    display: flex;
    align-items: center;
    margin-right: ${Spacing.u2};

    span {
      font-weight: ${FontWeight.strong};
      margin-left: ${Spacing.u2};
    }
  `,
}

interface StateList {
  type: ItemType
  count: number
}

type ItemType = RolllStateType | "all"
