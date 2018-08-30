import React from 'react';
import { mount, shallow } from 'enzyme';
import _clone from 'lodash/clone';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CaseDetailsFilterConnect, { CaseDetailsFilter } from './CaseDetailsFilter';
import constantData from '../../settings.json';

const preference = _clone(constantData.preferences.common);

describe('Test suits for <CaseDetailsFilter />', () => {
    const mockStore = configureStore([]);
    const store = mockStore({
        context: { preferences: preference },
        caseDetailsData: {
            caseDetailsData: {
                caseDetailsFilter: [
                    {
                        id: '100',
                        name: 'User Added Note',
                        type: 'Add Note',
                    },
                ],
            },
        },
    });
    const wrapper = mount(
        <Provider store={store}>
            <CaseDetailsFilterConnect />
        </Provider>,
    );

    const defaultProps = {
        toggleFilterBox: () => { },
        actions: { updateCaseDetailsFilter: () => { } },
    };

    const shallowWrapper = shallow(<CaseDetailsFilter preferences={preference} {...defaultProps}/>);
    const instance = shallowWrapper.instance();
    instance.setState({ filters: [] });

    it('updateCaseDetailsFilter funtion should be invoked', () => {
        instance.showValue(true, {
            id: '100',
            name: 'User Added Note',
            type: 'Add Note',
        });
        instance.showValue(false, {
            id: '100',
            name: 'User Added Note',
            type: 'Add Note',
        });
        instance.showValue('', {
            id: '100',
            name: 'User Added Note',
            type: 'Add Note',
        });
    });
    it('render funtion should be invoked', () => {
        wrapper.instance().render();
    });
    it(' triggers addEventListener', () => {
        const instance1 = shallowWrapper.instance();
        instance1.node = {
            contains: () => true,
        };
        const e = { target: {
        } };
        shallowWrapper.instance().handleClick(e);
    });
    it('triggers removeEventListener', () => {
        const instance1 = shallowWrapper.instance();
        instance1.node = {
            contains: () => false,
        };
        const e = { target: {
        } };
        shallowWrapper.instance().handleClick(e);
    });
    it('will test something after being mounted', () => {
        wrapper.unmount();
    });
    it('click on checkbox', () => {
        shallowWrapper.find('.filterCheckbox').at(0).simulate('click', { target: { checked: true } });
    });
    it('Check on empty Case', () => {
        const store1 = mockStore({
            context: { preferences: preference },
            caseDetailsData: {
                caseDetailsData: {
                },
            },
        });
        mount(
            <Provider store={store1}>
                <CaseDetailsFilterConnect />
            </Provider>,
        );
    });
});
