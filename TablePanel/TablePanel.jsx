import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames/bind';
import _find from 'lodash/find';
import styles from './TablePanel.css';
import Pagination from '../Pagination/Pagination';

const cx = classNames.bind(styles);

/**
 * Generic component for rendering table structure with sort and pagination options.
 * this.props.showPageCount: bool // Displays the current page count in the footer - Optional field.
 * this.props.showPagination: bool // Displays the pagination in the footer - Optional field.
 * this.props.align: left/center/right // Displays the current page count in the footer - Optional field.
 * this.props.rowData: Array of object with exact 'key' mentioned in the 'id' property of colData.
 * this.props.colData: [
 *  {
 *      id: 'caseId', // Key of the rowData object - Required field.
 *      name: 'Case Id', // Column name to be displayed - Required field.
 *      type: 'NUMBER/DATE/STRING', // Data type of column data - Optional field and default is STRING'.
 *      sortOrder: 'ASC/DESC', // Default sort order - Optional field.
 *      template: 'Template', // Module template used for rendering the data - Optional field.
 *      props: object, // Object with list of props used by template  - Optional field.
 *      noSort: bool, // Set to true if column doesn't require sorting option  - Optional field & default is false.
 *  }, ...
 * ]
 */
export default class TablePanel extends Component {

    static propTypes = {
        colData: PropTypes.oneOfType([PropTypes.array]).isRequired,
        rowData: PropTypes.oneOfType([PropTypes.array]).isRequired,
        rowsPerPage: PropTypes.number,
        showPageCount: PropTypes.bool,
        showPagination: PropTypes.bool,
        isInitSearch: PropTypes.bool,
        footerAlign: PropTypes.string,
        onSort: PropTypes.objectOf(PropTypes.func),
        getOtherSet: PropTypes.objectOf(PropTypes.func),
        isLazyLoad: PropTypes.bool,
        pageSetNumber: PropTypes.number,
        totalSingleSet: PropTypes.number,
        totalRecords: PropTypes.number,
        tablePanelContainer: PropTypes.string,
    };

    static defaultProps = {
        colData: [],
        rowData: [],
        rowsPerPage: 10,
        showPageCount: false,
        showPagination: false,
        footerAlign: 'center',
        onSort: () => {},
        isLazyLoad: false,
        pageSetNumber: 1,
        getOtherSet: () => {},
        totalSingleSet: 100,
        totalRecords: 0,
        isInitSearch: true,
        tablePanelContainer: '',
    }

    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 1,
            rowsPerPage: this.props.rowsPerPage,
            totalPages: Math.ceil(this.props.rowData.length / this.props.rowsPerPage),
            asc: [1, -1],
            desc: [-1, 1],
        };
        this.initParsers();
    }

    componentWillMount() {
        if (!__SERVER__) {
            const defaultCol = _find(this.props.colData, 'sortOrder') || {};
            if (defaultCol.sortOrder) {
                this.handleSort(defaultCol.id, defaultCol.type, defaultCol.sortOrder);
            }
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.rowData !== nextProps.rowData) {
            let pageIndex = 1;
            if (nextProps.isLazyLoad) {
                if (nextProps.pageSetNumber > this.props.pageSetNumber) {
                    pageIndex = 1 + ((nextProps.pageSetNumber * this.state.rowsPerPage) - this.state.rowsPerPage);
                } else {
                    pageIndex = (nextProps.pageSetNumber * this.state.rowsPerPage);
                }
            }


            if (nextProps.isInitSearch) {
                pageIndex = 1;
                this.setState({
                    sortedColumn: '',
                });
            }
            this.setState({
                pageIndex,
                totalPages: Math.ceil(nextProps.rowData.length / this.props.rowsPerPage),
            });
        }
    }

    getColumns = () => {
        const { sortedColumn, sortOrder } = this.state;
        const columnList = this.props.colData.map(col =>
            <th key={col.id} className={sortedColumn === col.id ? cx(sortOrder) : ''}>
                {col.noSort ? col.name : <button
                    onClick={() => this.handleSort(col.id, col.type)}>{col.name}</button>}
                {sortedColumn === col.id ? <span className={cx(sortOrder)} /> : ''}
            </th>);
        return <tr>{columnList}</tr>;
    }

    getNextPageOffset = () => {
        const nextPageOffset = this.state.pageIndex * this.state.rowsPerPage;
        return (nextPageOffset > this.props.rowData.length) ? this.props.rowData.length : nextPageOffset;
    }

    getRows = () => this.props.rowData.map((row, index) => {
        const i = this.props.isLazyLoad
                        ? this.state.pageIndex - ((this.props.pageSetNumber - 1) * this.props.rowsPerPage)
                        : this.state.pageIndex;
        if (index < (i * this.state.rowsPerPage) &&
            index >= ((i - 1) * this.state.rowsPerPage)) {
            const rowList = this.props.colData.map((col, rowIndex) => {
                const rowData = row[col.id];
                const Template = col.template;
                const tempProps = Template ? { ...{ dataSource: rowData }, ...col.props, ...{ row } } : '';
                return (<td key={row[col.id + rowIndex]}>{(Template && (rowData || tempProps.dataSource)) ?
                    <Template {...tempProps} /> : rowData}</td>);
            });
            return <tr>{rowList}</tr>;
        }
        return '';
    });

    comparator = (colId, sortOrder = this.state.asc, parser) =>
        (a, b) => {
            const aColumn = parser.format(a[colId]);
            const bColumn = parser.format(b[colId]);

            if (aColumn === bColumn) {
                return 0;
            }
            if (aColumn > bColumn) {
                return sortOrder[0];
            }
            return sortOrder[1];
        };

    initParsers = () => {
        this.parsers = {
            DATE: {
                format: (val) => {
                    const [day, month, year] = val && val.split('-');
                    return new Date(year, month - 1, day);
                },
            },
            NUMBER: {
                format: (val) => {
                    const intVal = parseInt(val, 10);
                    return isNaN(intVal) ? 0 : intVal;
                },
            },
            STRING: { format: val => val && val.toLowerCase() },
        };
    }

    handlePagination = (index) => {
        const { getOtherSet } = this.props;

        if (this.props.isLazyLoad) {
            let requiredRecords = (index * this.state.rowsPerPage) - this.state.rowsPerPage;
            requiredRecords -= ((this.props.pageSetNumber - 1) * this.props.totalSingleSet);

            if (requiredRecords >= 0 && (this.props.rowData.length) > requiredRecords) {
                this.setState({
                    pageIndex: index,
                });
            } else {
                const pageNumber = Math.ceil((index * this.state.rowsPerPage) / 100);
                getOtherSet(pageNumber);
            }
        } else {
            this.setState({
                pageIndex: index,
            });
        }
    }

    handleSort = (colId, colType = 'STRING', defaultSort) => {
        let colOrder = defaultSort || 'asc';

        if (this.state.sortedColumn !== colId || defaultSort) {
            this.props.rowData.sort(this.comparator(colId, this.state[colOrder], this.parsers[colType]));
        } else {
            colOrder = this.toggleSort(this.state.sortOrder);
            this.props.rowData.reverse();
        }

        this.setState({
            pageIndex: 1,
            sortedColumn: colId,
            sortOrder: colOrder,
        });

        if (!defaultSort && this.props.onSort) {
            this.props.onSort(colId, colOrder);
        }
    }

    toggleSort = (sortOrder) => {
        const toggleSort = (sortOrder === 'asc') ? 'desc' : 'asc';
        return toggleSort;
    }

    render() {
        const { pageIndex, rowsPerPage, totalPages, pageSetNumber, isLazyLoad } = this.state;
        const { showPageCount, showPagination, footerAlign, rowData, tablePanelContainer } = this.props;

        const totalPage = (pageSetNumber * rowsPerPage) - rowsPerPage;
        const total = isLazyLoad ? (totalPage + totalPages) : totalPages;

        const showPaginationFlag = rowData.length > rowsPerPage && showPagination;

        return (
            <div className={cx('tableContainer', tablePanelContainer)}>
                <table>
                    <thead data-automation-id="table-head">{this.getColumns()}</thead>
                    <tbody data-automation-id="table-body">{this.getRows()}</tbody>
                </table>
                {(showPageCount || showPaginationFlag) ?
                    <div className={cx('pageContainer')}>
                        <Pagination
                            nextPageOffset={this.getNextPageOffset()}
                            prevPageOffset={(pageIndex * rowsPerPage) - (rowsPerPage - 1)}
                            totalProductsCount={this.props.rowData.length}
                            selectedPageNumber={pageIndex}
                            totalPages={totalPages}
                            onPageChange={this.handlePagination}
                            hasNextPage={pageIndex !== total}
                            hasPrevPage={pageIndex !== 1}
                            showPageCount={showPageCount}
                            showPagination={showPagination}
                            align={footerAlign}
                            totalRecords={this.props.totalRecords}
                            totalSingleSet={this.props.totalSingleSet}
                            pageSetNumber={this.props.pageSetNumber}
                            isInitSearch={this.props.isInitSearch}
                            isLazyLoad={this.props.isLazyLoad}
                            rowsPerPage={rowsPerPage}
                        />
                    </div>
                : ''}
            </div>
        );
    }
}
