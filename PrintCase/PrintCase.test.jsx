import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import _clone from 'lodash/clone';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PrintCaseConnect, { PrintCase } from './PrintCase';
import data from '../../../test/mock/CommonDetails.json';
import constantData from '../../settings.json';

const preference = _clone(constantData.preferences.common);

describe('Test suits for <PrintCase />', () => {
    const mockStore = configureStore([]);
    const store = mockStore({ context: { preferences: preference, deviceType: { isDeskTop: true } },
        caseDetailsData: { caseDetailsData: _clone(data) },
    });
    const getSourceText = sinon.spy();
    const getDestinationText = sinon.spy();
    const defaultProps = {
        getSourceText,
        getDestinationText,
    };
    let wrapper;
    beforeEach(() => {
        wrapper = mount(
            <Provider store={store}>
                <PrintCaseConnect {...defaultProps} />
            </Provider>,
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });
    const caseDetailsData = { caseDetailsData: _clone(data) };
    const shallowWrapper = shallow(<PrintCase
        {...defaultProps} preferences={preference} caseDetailsData={caseDetailsData} />);
    it('checking case component', () => {
        expect(shallowWrapper).to.exist;
        expect(shallowWrapper).to.have.length(1);
    });
});
