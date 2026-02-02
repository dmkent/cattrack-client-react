import { useState } from "react";
import { Col, Row } from "react-bootstrap";

import { useCategories } from "../hooks/useCategories";
import { useCategoryGroupSeries } from "../hooks/useCategoryGroupSeries";
import { useCategoryGroups } from "../hooks/useCategoryGroups";
import { useCategorySeries } from "../hooks/useCategorySeries";
import { PlotlyTimeSeries } from "./PlotlyTimeSeries";

type SelectionType = "category" | "categoryGroup";

export function Tracking(): JSX.Element | null {
  const { isLoading: isCatsLoading, data: categories } = useCategories();
  const { isLoading: isGroupsLoading, data: categoryGroups } =
    useCategoryGroups();
  const [selectionType, setSelectionType] = useState<SelectionType | null>(
    null,
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { isLoading: isCatLoading, data: categorySeries } = useCategorySeries(
    selectionType === "category" ? selectedId || "" : "",
  );
  const { isLoading: isGroupLoading, data: categoryGroupSeries } =
    useCategoryGroupSeries(
      selectionType === "categoryGroup" ? selectedId || "" : "",
    );

  if (isCatsLoading || isGroupsLoading) {
    return null;
  }

  // Auto-select first available item on initial load
  if (
    selectionType === null &&
    !isCatsLoading &&
    !isGroupsLoading &&
    (categories || categoryGroups)
  ) {
    if (categories && categories.length > 0) {
      setSelectionType("category");
      setSelectedId(categories[0].id);
    } else if (categoryGroups && categoryGroups.length > 0) {
      setSelectionType("categoryGroup");
      setSelectedId(categoryGroups[0].id);
    }
  }

  const handleSelectionChange = (value: string) => {
    const [type, id] = value.split(":");
    setSelectionType(type as SelectionType);
    setSelectedId(id);
  };

  const currentValue =
    selectionType && selectedId ? `${selectionType}:${selectedId}` : "";
  const isSeriesLoading = isCatLoading || isGroupLoading;
  const seriesData =
    selectionType === "category" ? categorySeries : categoryGroupSeries;

  return (
    <div>
      <h3>Spending tracking</h3>

      <Row>
        <Col md={12}>
          <select
            onChange={(e) => handleSelectionChange(e.target.value)}
            value={currentValue}
          >
            {categories && categories.length > 0 && (
              <optgroup label="Categories">
                {[...categories].map((category) => {
                  return (
                    <option
                      value={`category:${category.id}`}
                      key={`category:${category.id}`}
                    >
                      {category.name}
                    </option>
                  );
                })}
              </optgroup>
            )}
            {categoryGroups && categoryGroups.length > 0 && (
              <optgroup label="Category Groups">
                {[...categoryGroups].map((group) => {
                  return (
                    <option
                      value={`categoryGroup:${group.id}`}
                      key={`categoryGroup:${group.id}`}
                    >
                      {group.name}
                    </option>
                  );
                })}
              </optgroup>
            )}
          </select>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          {!isSeriesLoading && !!seriesData && (
            <PlotlyTimeSeries
              plot_type="bar"
              plot_invert={true}
              series={seriesData}
            />
          )}
        </Col>
      </Row>
    </div>
  );
}
