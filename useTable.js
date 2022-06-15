import { usePagination } from "ahooks";
import { useState } from "react";
import PropTypes  from "prop-types";
const PAGINATION_MAPPING = {
    total: "totalCount",
    pageSize: "pageSize",
    current: "page"
}


const useTable = (getTableData, options = {}) => {
    const { refreshOnWindowFocus = false, defaultPageSize = 30, defaultFilters = {}, paginationMapping = PAGINATION_MAPPING, ready = true } = options;
    const [filters, setFilters] = useState(defaultFilters);
    const { data, loading, pagination, refresh } = usePagination(
        ({ current, pageSize }) => {
            return getTableData({ [paginationMapping.current]: current, [paginationMapping.pageSize]: pageSize, filters })
        },
        { refreshOnWindowFocus, defaultPageSize, paginated: true, refreshDeps: [filters], ready }
    );
    return {
        tableProps: {
            dataSource: data?.list ?? []
            loading,
            pagination: {
                ...pagination,
                onShowSizeChange: (_page, _pageSize) => pagination.pageSize !== _pageSize && pagination.onChange(_page, _pageSize)
            },
        },
        refresh,
        [PAGINATION_MAPPING.total]: data?.total ?? 0
        filterCallback: _filters => setFilters(_filters)
    };
};

useTable.prototype = {
    getTableData: PropTypes.func,
    options: PropTypes.exact({
        defaultPageSize: PropTypes.number,
        defaultFilters: PropTypes.object,
        refreshOnWindowFocus: PropTypes.bool,
        paginationMapping: PropTypes.shape({
            [PAGINATION_MAPPING.pageSize]: PropTypes.string,
            [PAGINATION_MAPPING.current]: PropTypes.string,
            [PAGINATION_MAPPING.total]: PropTypes.string,
        })
    })
}



export default useTable
