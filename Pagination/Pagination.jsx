import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import classNames from 'classnames/bind';
import Icon from 'fusion-core-components/lib/components/Icon/Icon';
import YodaDropdown from 'yoda-fusion-site-components/lib/components/YodaDropdown/YodaDropdown';
import { getLocaleString } from 'yoda-fusion-site-components/lib/components/Pricing/PricingHelper';
import * as styles from './Pagination.css';

const cx = classNames.bind(styles);

class Pagination extends PureComponent {

    static propTypes = {
        hasNextPage: PropTypes.bool.isRequired,
        hasPrevPage: PropTypes.bool.isRequired,
        nextPageOffset: PropTypes.number.isRequired,
        prevPageOffset: PropTypes.number.isRequired,
        selectedPageNumber: PropTypes.number.isRequired,
        totalProductsCount: PropTypes.number.isRequired,
        totalPages: PropTypes.number.isRequired,
        isLazyLoad: PropTypes.bool,
        onPageChange: PropTypes.func,
        containerTheme: PropTypes.string,
        showPageCount: PropTypes.bool,
        showPagination: PropTypes.bool,
        align: PropTypes.bool,
        pageSetNumber: PropTypes.number,
        rowsPerPage: PropTypes.number,
        totalSingleSet: PropTypes.number,
        totalRecords: PropTypes.number,
    }

    static defaultProps = {
        hasNextPage: false,
        hasPrevPage: false,
        nextPageOffset: 0,
        prevPageOffset: 0,
        selectedPageNumber: 0,
        totalProductsCount: 0,
        totalPages: 0,
        onPageChange: null,
        showDropdown: null,
        enableDropDown: null,
        containerTheme: null,
        showPageCount: false,
        showPagination: false,
        align: '',
        isLazyLoad: false,
        pageSetNumber: 1,
        rowsPerPage: 10,
        totalSingleSet: 100,
        totalRecords: 0,
    }

    constructor(props) {
        super(props);
        this.state = {
            selectedPageNumber: this.props.selectedPageNumber,
        };
    }

    changeHandler(e) {
        this.props.onPageChange(Number(e));
        this.setState({
            selectedPageNumber: Number(e),
        });
    }

    navigatenPagination(number) {
        let gotopage = this.props.selectedPageNumber;
        /* istanbul ignore next */
        if (this.props.selectedPageNumber > 0) {
            gotopage = this.props.selectedPageNumber + number;
        }
        this.props.onPageChange(gotopage);
    }

    renderDropdownOptions() {
        const options = [];
        if (this.props.totalPages > 0) {
            for (let i = 1; i < this.props.totalPages + 1; i += 1) {
                const val = this.props.isLazyLoad
                    ? i + ((this.props.pageSetNumber * this.props.rowsPerPage) - this.props.rowsPerPage)
                    : i;
                options.push({
                    displayKey: val,
                    value: val,
                });
            }
        } else {
            options.push({
                displayKey: '1',
                value: 1,
            });
        }

        return (<YodaDropdown
            dataSource={options}
            onChange={e => this.changeHandler(e)}
            defaultValue={this.props.selectedPageNumber}
            value={this.state.selectedPageNumber}
            mobileTheme={styles.dropdown}
            optionsTheme={styles.optionsTheme}
            dropdownTheme={styles.dropdownTheme}
            automationId="paginationDropdown"
        />);
    }
    render() {
        const {
            hasNextPage,
            hasPrevPage,
            nextPageOffset,
            prevPageOffset,
            totalProductsCount,
            containerTheme,
            totalPages,
            showPageCount,
            showPagination,
            totalSingleSet,
            pageSetNumber,
            totalRecords,
            isLazyLoad,
        } = this.props;

        const hasNextSet = totalRecords > (pageSetNumber * totalSingleSet);
        const enableNextButton = hasNextPage || (isLazyLoad && hasNextSet);

        const totalPage = (this.props.pageSetNumber * this.props.rowsPerPage) - this.props.rowsPerPage;
        const total = isLazyLoad ? (totalPage + totalPages) : totalPages;

        const nextpageclass = enableNextButton ? 'active' : 'inactive';
        const prevpageclass = hasPrevPage ? 'active' : 'inactive';
        const alignpager = (showPageCount && showPagination) ? '' : this.props.align;

        return (
            <div className={cx('paginationContainer', containerTheme)}>
                {showPageCount ?
                    (<div className={cx('paginationSection', alignpager)}>
                        <div className={cx('paginationLeft')} data-automation-id="pagination-count">
                            <span className={cx('boldText')}>Showing:</span>{` ${getLocaleString(prevPageOffset)} - ${getLocaleString(nextPageOffset)} of ${getLocaleString(totalProductsCount)}`}
                        </div>
                    </div>) : ''}
                <div className={cx('paginationSection', 'pager', alignpager)}>
                    {(showPagination) ? (
                        <div className={cx('paginationRight')}>
                            <button className={cx('prevNavigation')} onClick={() => this.navigatenPagination(-1)} disabled={!hasPrevPage} data-automation-id="product-pagination-left">
                                <Icon pathClassName={cx(prevpageclass)} iconType="svg" className={cx('navigateIcon', hasPrevPage ? '' : 'navigateIconDisabled')} width="18px" height="18px" viewBox="0 0 18 18" name={'arrow-left'} />
                            </button>
                            <div className={cx('dropdownContainer')}>
                                <span className={cx('boldText')}>Page:</span>
                                <div className={cx('dropdownMain')}>
                                    {this.renderDropdownOptions()}
                                </div>
                                <div data-automation-id="page-count"className={cx('dropdownPageCount')}>of {getLocaleString(total)}</div>
                            </div>
                            <button className={cx('nextNavigation')} onClick={() => this.navigatenPagination(+1)} disabled={!enableNextButton} data-automation-id="product-paginationRight">
                                <Icon pathClassName={cx(nextpageclass)} iconType="svg" className={cx('navigateIcon', enableNextButton ? '' : 'navigateIconDisabled')} width="18px" height="18px" viewBox="0 0 18 18" name={'arrow-right'} />
                            </button>
                        </div>
                    ) : ''}
                </div>
            </div>
        );
    }
}

export default Pagination;
