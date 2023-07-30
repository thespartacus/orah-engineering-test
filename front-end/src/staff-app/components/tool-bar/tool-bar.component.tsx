import React, { useState } from "react"
import styled from "styled-components"
import { Spacing, FontWeight, BorderRadius, FontSize } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import Button from "@material-ui/core/Button"
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export type ToolbarAction = "roll" | "sort" | "search"
export type SortOrder = "asc" | "desc"
export type SortBy = "first_name" | "last_name"

interface ToolbarProps {
    onItemClick: (action: ToolbarAction, value?: string) => void
}

export const Toolbar: React.FC<ToolbarProps> = (props) => {
    const { onItemClick } = props
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
    const [sortBy, setSortBy] = useState<SortBy>("first_name")
    const [searchTerm, setSearchTerm] = useState("")

    const handleSortToggle = () => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc"
        setSortOrder(newSortOrder)
        onItemClick("sort", `${sortBy}:${newSortOrder}`)
    }

    const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSortBy = e.target.value as SortBy
        setSortBy(newSortBy)
        onItemClick("sort", `${newSortBy}:${sortOrder}`)
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        onItemClick("search", e.target.value)
    }

    return (
        <S.ToolbarContainer>
            <S.SortContainer>
                <S.SortByContainer onClick={handleSortToggle}>
                    {`Sort `}
                    <S.IconWrapper>
                        {sortOrder === "asc" ? (
                            <FontAwesomeIcon icon={faArrowUp} size="sm" />
                        ) : (
                            <FontAwesomeIcon icon={faArrowDown} size="sm" />
                        )}
                    </S.IconWrapper>
                </S.SortByContainer>
                <S.SortBySelect value={sortBy} onChange={handleSortByChange}>
                    <option value="first_name">First Name</option>
                    <option value="last_name">Last Name</option>
                </S.SortBySelect>
            </S.SortContainer>
            <S.SearchInput
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
        </S.ToolbarContainer>
    )
}

const S = {
    ToolbarContainer: styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        background-color: ${Colors.blue.base};
        padding: 6px 14px;
        font-weight: ${FontWeight.strong};
        border-radius: ${BorderRadius.default};
    `,
    SortContainer: styled.div`
        cursor: pointer;
        display: flex;
        width: 172px;
    `,
    SortByContainer: styled.div`
        display: flex;
        align-items: center;
    `,
    IconWrapper: styled.div`
        margin-left: ${Spacing.u1};
        margin-right: ${Spacing.u1};
        padding: ${Spacing.u1};
        border-radius: ${BorderRadius.default};
        margin-top: -2px;
    `,
    SearchInput: styled.input`
        margin-left: ${Spacing.u2};
        padding: ${Spacing.u1} ${Spacing.u2};
        border-radius: ${BorderRadius.default};
        border: none;
        outline: none;
        font-size: ${FontSize.u3}};
        height: 33px;
        width: 240px;
        background-color: ${Colors.neutral.lighter};
    `,
    SortBySelect: styled.select`
        padding: ${Spacing.u1} ${Spacing.u2};
        border-radius: ${BorderRadius.default};
        border: 1px solid ${Colors.neutral.lighter};
        outline: none;
        font-size: inherit;
        background-color: ${Colors.blue.base};
        color: ${Colors.neutral.lighter};
    `,
    Button: styled(Button)`
        && {
            padding: ${Spacing.u2};
            font-weight: ${FontWeight.strong};
            border-radius: ${BorderRadius.default};
            border: 1px solid ${Colors.neutral.lighter};
            color: ${Colors.neutral.lighter};
            width: 172px;
        }
    `
}