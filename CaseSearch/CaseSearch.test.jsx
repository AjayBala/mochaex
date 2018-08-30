import React from 'react';
import { browserHistory } from 'react-router';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import _clone from 'lodash/clone';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CaseSearchConnect, { CaseSearch } from './CaseSearch';
import data from './mock.json';
import CaseColumn from '../../common/CaseColumn';

const el1 = <div>Filter</div>;
describe('Test suits for <CaseSearch />', () => {
    const mockStore = configureStore([]);
    const store = mockStore({
        context: { deviceType: { isDeskTop: true } },
        casesearchResults: data,
        filterResults: {
            selectedFilterResults: [
                { name: 'Closed', id: '3', resource: 'status' },
            ],
        },
    });
    let wrapper;
    beforeEach(() => {
        wrapper = mount(
            <Provider store={store}>
                <CaseSearchConnect caseList={_clone(data)} />
            </Provider>,
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('should load the CaseSearch component', () => {
        expect(wrapper).to.exist;
        expect(wrapper).to.have.length(1);
    });

    it('should fire onChange method when search text got changed', () => {
        expect(wrapper).to.exist;
        const searchText = wrapper.find('#caseSearch').at(0);
        wrapper.onChange = sinon.spy();
        const onchange = wrapper.onChange;
        searchText.at(0).simulate('change');
        expect(onchange).to.be.called;
    });

    it('should trigger the searchHandler metohd with email oncliking of the search button', () => {
        const data1 = {};
        const shallowWrapper = shallow(<CaseSearch caseList={_clone(data)} selectedFilter={data1} />);
        const instance = shallowWrapper.instance();
        expect(instance.state.searchText).to.equal('');
        instance.backSearch();
        expect(browserHistory.goBack).to.have.been.called;
        shallowWrapper.setProps({
            actions: {
                getcaseListing: sinon.spy(),
                getcaseSearchListing: sinon.spy(),
                caseSearchEmptyRequest: sinon.spy(),
                maintainFilterItemRequest: sinon.spy(),
            },
            selectedFilter: [
                { name: 'Closed', id: '3', resource: 'status' },
                { name: 'open', id: '2', resource: 'priority' },
                { name: 'bye', id: '4', resource: 'status' },
                { name: 'hi', id: '32', resource: 'type' },
                { name: 'hi', id: '32', resource: '' },
            ],
        });
        shallowWrapper.find('.filterLabel').at(0).simulate('click');
        shallowWrapper.setProps({
            selectedFilter: [
                { name: 'Closed', id: '3', resource: 'status' },
            ],
        });
        expect(instance.removeFilter({ name: 'Closed', id: '3', resource: 'status' })).to.be.called;
        instance.onChange('test@gmail.com');
        expect(instance.state.searchText).to.equal('test@gmail.com');
        instance.searchHandler();
        instance.onChange('ad');
        expect(instance.state.searchText).to.equal('ad');
        instance.searchHandler();
        const item = {
            name: '24HR Cancel',
            id: '1',
            resource: 'type',
        };
        instance.removeFilter(item);
        instance.triggerSort();
        shallowWrapper.setState({ searchText: 'test@gmail.com' });
        expect(instance.state.searchText).to.equal('test@gmail.com');
        instance.onReset();
        expect(instance.state.searchText).to.equal('');
    });


    it('should trigger the searchHandler metohd with email oncliking of the search button', () => {
        const data1 = {};
        const shallowWrapper = shallow(<CaseSearch caseList={_clone(data)} selectedFilter={data1} />);
        const instance = shallowWrapper.instance();
        expect(instance.state.searchText).to.equal('');
        instance.backSearch();
        expect(browserHistory.goBack).to.have.been.called;
        shallowWrapper.setProps({
            actions: {
                getcaseListing: sinon.spy(),
                getcaseSearchListing: sinon.spy(),
                caseSearchEmptyRequest: sinon.spy(),
                maintainFilterItemRequest: sinon.spy(),
            },
            selectedFilter: [
                { name: 'Closed', id: '3', resource: 'status' },
                { name: 'open', id: '2', resource: 'priority' },
                { name: 'bye', id: '4', resource: 'status' },
                { name: 'hi', id: '32', resource: 'type' },
                { name: 'hi', id: '32', resource: '' },
            ],
        });
        shallowWrapper.find('#closeFunction').at(0).simulate('click');
        shallowWrapper.setProps({
            selectedFilter: [
                { name: 'Closed', id: '3', resource: 'status' },
            ],
        });
        const item = {
            name: '24HR Cancel',
            id: '1',
            resource: 'type',
        };
        instance.removeFilter(item);
        instance.triggerSort();
    });

    it('should trigger the searchHandler metohd with CaseId oncliking of the search button', () => {
        wrapper = shallow(<CaseSearch caseList={_clone(data)} />);
        const props = {
            actions: {
                getcaseListing: sinon.spy(),
                getcaseSearchListing: sinon.spy(),
                caseSearchEmptyRequest: sinon.spy(),
                maintainFilterItemRequest: sinon.spy(),
            },
        };
        const instance = wrapper.instance();
        expect(instance.state.searchText).to.equal('');
        instance.onChange('20180201187916');
        expect(instance.state.searchText).to.equal('20180201187916');
        wrapper.setProps(props);
        // instance.searchHandler();
        instance.searchHandler(1);
        instance.searchCommonParams();
        instance.triggerSort();
        wrapper.setState({ searchText: '20180201187916' });
        expect(instance.state.searchText).to.equal('20180201187916');
        expect(props.actions.getcaseListing).to.be.called;
        instance.onReset();
        expect(instance.state.searchText).to.equal('');
    });
    it('should trigger the searchHandler metohd with Phone oncliking of the search button', () => {
        wrapper = shallow(<CaseSearch caseList={_clone(data)} />);
        const props = {
            actions: {
                getcaseListing: sinon.spy(),
                getcaseSearchListing: sinon.spy(),
                caseSearchEmptyRequest: sinon.spy(),
                maintainFilterItemRequest: sinon.spy(),
            },
        };
        const instance = wrapper.instance();
        expect(instance.state.searchText).to.equal('');
        instance.onChange('123 234-7812');
        expect(instance.state.searchText).to.equal('123 234-7812');
        wrapper.setProps(props);
        wrapper.setState({ sortColId: 'Priority' });
        wrapper.setState({ sortOrd: 'asc' });
        instance.searchHandler();
        instance.searchCommonParams();
        instance.triggerSort();
        wrapper.setState({ searchText: '123 234-7812' });
        expect(instance.state.searchText).to.equal('123 234-7812');
        expect(props.actions.getcaseListing).to.be.called;
        instance.onReset();
        expect(instance.state.searchText).to.equal('');
    });
    it('should reset the searchtext on clicking the close icon', () => {
        wrapper = shallow(<CaseSearch caseList={_clone(data)} />);
        const instance = wrapper.instance();
        instance.onChange('test@gmail.com');
        expect(instance.state.searchText).to.equal('test@gmail.com');
        expect(instance.state.searchText).to.have.length(14);
        instance.onReset();
        expect(instance.state.searchText).to.equal('');
    });
    it('should reset the searchtext on clicking the close icon', () => {
        wrapper = shallow(<CaseSearch caseList={_clone(data)} />);
        const instance = wrapper.instance();
        instance.onChange('20180201187916');
        expect(instance.state.searchText).to.equal('20180201187916');
        expect(instance.state.searchText).to.have.length(14);
        instance.onReset();
        expect(instance.state.searchText).to.equal('');
    });
    it('should datepicker component exist', (done) => {
        const onCaseSearchEmptyRequest = sinon.spy();
        const onMaintainFilterItemRequest = sinon.spy();
        wrapper = shallow(<CaseSearch
            caseList={_clone(data)}
            actions={{
                caseSearchEmptyRequest: onCaseSearchEmptyRequest,
                maintainFilterItemRequest: onMaintainFilterItemRequest,
            }} />);
        const startDate = wrapper.find('.startdatePicker');
        const instance = wrapper.instance();
        wrapper.setState({ searchText: 'test@gmail.com' });
        instance.handleChangeStart();
        instance.handleChangeEnd();
        instance.backSearch();
        instance.toggleFilterBox();
        instance.onKeyChangeHandler({ which: '113' });
        instance.onKeyChangeHandler({ keyCode: '1233' });
        instance.onKeyChangeHandler({ which: 13 });
        expect(wrapper).to.have.length(1);
        expect(startDate).to.have.length(4);
        done();
    });
    it('should toggle click component ', () => {
        const wrapper1 = mount(<CaseSearch />);
        const instance = wrapper1.instance();
        instance.node = {
            contains: () => true,
        };
        wrapper1.setState({ expanded: true });
        expect(instance.state.expanded).to.equal(true);
        instance.toggleFilterBox();
        expect(wrapper.contains(el1));
        expect(instance.state.expanded).to.equal(false);
        expect(instance.state.expanded).to.equal(false);
    });
    it('should isLoading state', () => {
        wrapper.setState({ isLoading: false });
        wrapper = shallow(<CaseSearch caseList={_clone(data)} />);
        wrapper.setState({ isLoading: true });
        wrapper = shallow(<CaseSearch caseList={_clone(data)} />);
        wrapper.setState({ emptySearch: true });
    });


    it('should validate date', () => {
        wrapper = shallow(<CaseSearch caseList={_clone(data)} />);
        const instance = wrapper.instance();
        wrapper.setState({ startDate: null });
        instance.searchHandler();
        wrapper.setState({ startDate: '2015-01-01T14:59:56+05:30', endDate: null });
        instance.searchHandler();
        wrapper.setState({ dateInvalid: true, endDateInvalid: true });
        instance.searchHandler();
        wrapper.setState({ hasError: true });
        instance.searchHandler();
    });
    it('without passing the caselist', () => {
        const storeNew = mockStore({
            context: { deviceType: { isDeskTop: true } },
            casesearchResults: {
                searchNewResponse: {},
            },
            filterResults: {
                selectedFilterResults: {},
            },
        });
        wrapper = mount(
            <Provider store={storeNew}>
                <CaseSearchConnect caseList={_clone(data)} />
            </Provider>,
        );
        expect(wrapper).to.exist;
        expect(wrapper).to.have.length(1);
    });


    it('should able to render case id template', () => {
        expect(CaseColumn).not.to.equal(undefined);
        expect(CaseColumn.length).to.equal(8);

        const CaseLink = CaseColumn[0].template;
        wrapper = shallow(<CaseLink dataSource={12345} />);
        expect(wrapper.find('Link').length).to.equal(1);
    });

    it('should able to render Date template', () => {
        expect(CaseColumn).not.to.equal(undefined);
        expect(CaseColumn.length).to.equal(8);

        const CreatedDate = CaseColumn[2].template;
        const createdDate = { createdDate: '04/02/2018' };
        wrapper = shallow(<CreatedDate row={createdDate} />);
        expect(wrapper.find('span').length).to.equal(1);
    });

    it('should able to render age template', () => {
        expect(CaseColumn).not.to.equal(undefined);
        expect(CaseColumn.length).to.equal(8);

        const Age = CaseColumn[4].template;
        wrapper = shallow(<Age dataSource={'6d 22h'} />);
        expect(wrapper.find('span').length).to.equal(1);
    });

    it('should able to render priority Text template', () => {
        expect(CaseColumn).not.to.equal(undefined);
        expect(CaseColumn.length).to.equal(8);

        const PriortityText = CaseColumn[5].template;
        wrapper = shallow(<PriortityText dataSource={'High'} />);
        expect(wrapper.find('div').length).to.equal(1);
    });

    it('should able to render release Date template', () => {
        expect(CaseColumn).not.to.equal(undefined);
        expect(CaseColumn.length).to.equal(8);

        const ReleaseDate = CaseColumn[7].template;
        const releaseDate = { releaseDate: '04/02/2018' };
        wrapper = shallow(<ReleaseDate row={releaseDate} />);
        expect(wrapper.find('span').length).to.equal(1);
    });

    it('should able to render priority status template', () => {
        expect(CaseColumn).not.to.equal(undefined);
        expect(CaseColumn.length).to.equal(8);

        const PriorityHigh = CaseColumn[5].template;
        wrapper = shallow(<PriorityHigh dataSource={'Low'} />);
        expect(wrapper.find('div').length).to.equal(1);
    });


    it('should load the caseSearch component', () => {
        wrapper = mount(<CaseSearch/>);
        expect(wrapper.ref('this.node'));
    });
});
