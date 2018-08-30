import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import _clone from 'lodash/clone';
import mock from './mock.json';
import TablePanel from './TablePanel';
import CaseColumn from './CaseColumn';

const data = [
    {
        id: '20180109000127',
        type: 'CCR Pending',
        createdDate: '1516687200000',
        age: '43200000',
        priority: '1',
        status: {
            value: 2,
            extensions: 0,
        },
        releaseDate: null,
        href: '/v1/cases/20180109000127',
    }];

const data1 = [
    {
        id: '20180109000120',
        type: 'CCR Pending',
        createdDate: '1516687200000',
        age: '43200000',
        priority: '1',
        status: {
            value: 2,
            extensions: 0,
        },
        releaseDate: null,
        href: '/v1/cases/20180109000127',
    }];

describe('Test suits for <TablePanel />', () => {
    const mockStore = configureStore([]);
    const store = mockStore({ context: { deviceType: { isDeskTop: true } } });
    let wrapper;

    beforeEach(() => {
        const tableProps = {
            rowData: _clone(mock.data.searchList),
            colData: CaseColumn,
            showPageCount: true,
            showPagination: true,
            isLazyLoad: true,
        };

        wrapper = mount(
            <Provider store={store}>
                <TablePanel {...tableProps} />
            </Provider>,
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('should load the component, if the resuable component exist', () => {
        expect(wrapper).to.exist;
        expect(wrapper).to.have.length(1);
    });

    it('should able to sort the column with number type in ascendening and descending order', () => {
        const colButton = wrapper.find('thead th button');
        expect(colButton).to.exist;
        expect(colButton).to.have.length(6);
        expect(wrapper.find('tbody tr').at(0).find('td').at(0)
            .text()).to.contain('20171220000049');

        colButton.at(0).simulate('click');
        expect(wrapper.find('tbody tr').at(0).find('td').at(0)
            .text()).to.contain('20181220000067');

        colButton.at(0).simulate('click');
        expect(wrapper.find('tbody tr').at(0).find('td').at(0)
            .text()).to.contain('20171220000049');

        colButton.at(0).simulate('click');
        expect(wrapper.find('tbody tr').at(0).find('td').at(0)
            .text()).to.contain('20181220000067');
    });

    it('should able to sort the column with date type in ascendening and descending order', () => {
        const colButton = wrapper.find('thead th button');
        expect(colButton).to.exist;
        expect(colButton).to.have.length(6);

        expect(wrapper.find('tbody tr').at(0).find('td').at(2)
            .text()).to.contain('20-05-17');

        colButton.at(2).simulate('click');
        expect(wrapper.find('tbody tr').at(0).find('td').at(2)
            .text()).to.contain('25-05-16');
    });

    it('should able to sort the column with string type in ascendening and descending order', () => {
        const colButton = wrapper.find('thead th button');
        expect(colButton).to.exist;
        expect(colButton).to.have.length(6);

        expect(wrapper.find('tbody tr').at(0).find('td').at(1)
            .text()).to.contain('24HR Cancel');

        colButton.at(1).simulate('click');
        expect(wrapper.find('tbody tr').at(0).find('td').at(1)
            .text()).to.contain('24HR Cancel');

        colButton.at(1).simulate('click');
        expect(wrapper.find('tbody tr').at(0).find('td').at(1)
            .text()).to.contain('24HR Progress');
    });

    it('should able to go to the next page', () => {
        const nextPage = wrapper.find('.pageContainer button.nextNavigation');
        expect(nextPage).to.exist;
        expect(nextPage).to.have.length(1);

        nextPage.simulate('click');
        expect(wrapper.find('tbody tr').at(0).find('td').at(0)
            .text()).to.contain('20171220000082');
    });

    describe('Test suits for <TablePanel /> methods', () => {
        let wrapperNew = shallow(<TablePanel rowData={_clone(mock.data.searchList)} colData={CaseColumn} />);

        it('should be able sort array, if sort order not passed', () => {
            const searchList = _clone(mock.data.searchList);
            const instance = wrapperNew.instance();
            expect(searchList[0].caseId).to.equal(20171220000062);
            expect(typeof instance.comparator).to.equal('function');
            expect(typeof instance.parsers).to.equal('object');
            searchList.sort(instance.comparator('caseId', undefined, instance.parsers.NUMBER));

            expect(searchList[0].caseId).to.equal(20171220000049);
        });

        it('should not sort array, if invalid number column been passed for sorting', () => {
            const searchList = _clone(mock.data.searchList);
            const instance = wrapperNew.instance();
            expect(searchList[0].caseStatus).to.equal('Closed');
            expect(typeof instance.comparator).to.equal('function');
            expect(typeof instance.parsers).to.equal('object');
            searchList.sort(instance.comparator('caseStatus', undefined, instance.parsers.NUMBER));

            expect(searchList[0].caseStatus).to.equal('Closed');
        });

        it('should be able sort array, if sort order not passed and deafult sort order is not available', () => {
            const searchList = _clone(mock.data.searchList);
            const colData = _clone(CaseColumn);
            delete colData[0].sortOrder;

            wrapperNew = shallow(
                <TablePanel rowData={searchList} colData={colData} showPagination showPageCount />);
            const instance = wrapperNew.instance();
            expect(searchList[0].caseId).to.equal(20171220000062);
            expect(typeof instance.comparator).to.equal('function');
            expect(typeof instance.parsers).to.equal('object');
            searchList.sort(instance.comparator('caseId', undefined, instance.parsers.NUMBER));

            expect(searchList[0].caseId).to.equal(20171220000049);
        });
    });
    it('Componentwillreceiveprops with reinitiate scenario', () => {
        const TablePanelWrapper = shallow(<TablePanel
            isLazyLoad rowData={data} rowsPerPage="10" pageSetNumber={1} />);

        TablePanelWrapper.setState({
            rowsPerPage: 10,
        });
        TablePanelWrapper.setProps({
            rowData: data1,
            pageSetNumber: 2,
        });

        expect(wrapper).to.exist;
    });
    it('Componentwillreceiveprops with reinitiate scenario', () => {
        const TablePanelWrapper = shallow(<TablePanel
            isLazyLoad rowData={data} rowsPerPage="10" pageSetNumber={2} />);

        TablePanelWrapper.setState({
            rowsPerPage: 10,
        });
        TablePanelWrapper.setProps({
            rowData: data1,
            pageSetNumber: 1,
        });

        expect(wrapper).to.exist;
    });
    it('Componentwillreceiveprops with reinitiate scenario', () => {
        const TablePanelWrapper = shallow(<TablePanel
            isLazyLoad={false} rowData={data} rowsPerPage="10" />);

        TablePanelWrapper.setProps({
            rowData: data1,
            pageSetNumber: 1,
        });

        expect(wrapper).to.exist;
        TablePanelWrapper.instance().handlePagination(2);
    });

    it('Componentwillreceiveprops with reinitiate scenario', () => {
        const TablePanelWrapper = shallow(<TablePanel
            isLazyLoad rowData={data} rowsPerPage="1" />);

        TablePanelWrapper.instance().handlePagination(2);

        expect(wrapper).to.exist;
    });
});
