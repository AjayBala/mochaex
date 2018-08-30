import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Pagination from './Pagination';

describe('<Pagination /> with default values', () => {
    let wrapper;

    beforeEach(() => {
        const onPageChange = sinon.spy();
        const hasNextPage = true;
        const hasPrevPage = false;
        wrapper = mount(<Provider store={configureStore([])({})}><Pagination
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            nextPageOffset={24}
            prevPageOffset={0}
            selectedPageNumber={1}
            totalProductsCount={618}
            totalPages={26}
            onPageChange={onPageChange}
            showPageCount
            showPagination
          /></Provider>);
    });

    it('Pagination component should exist ', () => {
        expect(wrapper).to.exist;
    });
});


describe('<Pagination /> without organicZoneInfo values', () => {
    let wrapper;
    const onPageChange = sinon.spy();
    beforeEach(() => {
        const hasNextPage = true;
        const hasPrevPage = false;
        wrapper = mount(<Provider store={configureStore([])({})}><Pagination
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            nextPageOffset={24}
            prevPageOffset={0}
            totalProductsCount={618}
            selectedPageNumber={0}
            totalPages={26}
            onPageChange={onPageChange}
            showPageCount
            showPagination
        /></Provider>);
    });

    it('Pagination component should exist ', () => {
        expect(wrapper).to.exist;
    });
});

describe('<Pagination /> without selectedPageNumber more than 1 values', () => {
    let wrapper;
    const onPageChange = sinon.spy();
    beforeEach(() => {
        const hasNextPage = false;
        const hasPrevPage = true;
        wrapper = mount(<Provider store={configureStore([])({})}><Pagination
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            nextPageOffset={24}
            prevPageOffset={0}
            totalProductsCount={618}
            selectedPageNumber={1}
            totalPages={0}
            onPageChange={onPageChange}
            showPageCount
            showPagination
        /></Provider>);
    });

    it('Pagination component should exist ', () => {
        expect(wrapper).to.exist;
    });
});


describe('<Pagination /> on change check', () => {
    let wrapper;
    const onPageChange = sinon.spy();
    beforeEach(() => {
        const hasNextPage = true;
        const hasPrevPage = false;
        wrapper = mount(<Provider store={configureStore([])({})}><Pagination
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            nextPageOffset={24}
            prevPageOffset={0}
            selectedPageNumber={1}
            totalProductsCount={618}
            totalPages={26}
            onPageChange={onPageChange}
            showPageCount
            showPagination
        /></Provider>);
    });

    it('Pagination component should exist ', () => {
        expect(wrapper).to.exist;
    });
});


describe('<Pagination /> on navigatenPagination click check', () => {
    let wrapper;
    const onPageChange = sinon.spy();
    beforeEach(() => {
        const hasNextPage = true;
        const hasPrevPage = true;
        wrapper = mount(<Provider store={configureStore([])({})}><Pagination
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            nextPageOffset={24}
            prevPageOffset={0}
            selectedPageNumber={1}
            totalProductsCount={618}
            totalPages={26}
            onPageChange={onPageChange}
            showPageCount
            showPagination
        /></Provider>);
    });

    it('Pagination component should exist ', () => {
        wrapper = mount(<Provider store={configureStore([])({})}><Pagination
            hasNextPage
            hasPrevPage
            nextPageOffset={24}
            prevPageOffset={0}
            selectedPageNumber={1}
            totalProductsCount={618}
            totalPages={26}
            onPageChange={sinon.spy()}
            showPageCount
            showPagination
            deviceType={{ isDesktop: true }}
        /></Provider>);
        wrapper.find('YodaDropdown').props().onChange({ currentTarget: { value: '2' } });
        expect(wrapper).to.exist;
    });

    it('Pagination component should exist ', () => {
        wrapper = mount(<Provider store={configureStore([])({})}><Pagination
            hasNextPage
            hasPrevPage
            nextPageOffset={24}
            prevPageOffset={0}
            selectedPageNumber={1}
            totalProductsCount={618}
            totalPages={26}
            onPageChange={sinon.spy()}
            showPagination
            deviceType={{ isDesktop: true }}
        /></Provider>);
        expect(wrapper).to.exist;
    });

    it('navigatenPagination prev button should be called once', () => {
        wrapper.find('button').at(0).simulate('click');
        expect(onPageChange).to.be.called;
    });

    it('navigatenPagination next button should be called once', () => {
        const event = {
            type: 'event',
            nativeEvent: {
                stopImmediatePropagation: () => {},
                preventDefault: sinon.stub(),
            },
        };
        wrapper.find('button').at(1).simulate('click', event);
        expect(onPageChange).to.be.called;
    });
});
