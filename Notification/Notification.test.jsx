import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { Notification } from './Notification';
import { preferences } from '../../settings.json';


describe('Test suits for <Notification />', () => {
    let cases = [
        {
            id: 606,
            href: '/case-management/v1/agents/2560025/notifications/606',
            type: 1,
            description: 'dsvcsdvcsdvsdvsdcsdvdvsdv',
            caseInfo: {
                id: 20180312000319,
                href: '/v1/cases/20180312000319',
            },
            created: '1523255565970',
            is_read_already: false,
        },
        {
            id: 607,
            href: '/case-management/v1/agents/2560025/notifications/607',
            type: 2,
            description: 'wefewfwfewfwfwsfwfwesfwsc',
            caseInfo: {
                id: 20180322000338,
                href: '/v1/cases/20180322000338',
            },
            created: '',
            is_read_already: false,
        },
    ];
    const removeSelectedNotification = sinon.spy();
    const getCaseDetails = sinon.spy();
    const shallowWrapper = shallow(
        <Notification
            cases={cases} preferences={preferences.common}
            action={{ getCaseDetails, removeSelectedNotification }} />,
    );

    it('checking case component', () => {
        expect(shallowWrapper).to.exist;
    });
    it('Should be called handleNotification', () => {
        const event = {
            preventDefault: () => undefined,
            stopPropagation: () => undefined,
        };
        shallowWrapper.instance().handleNotification(event, '621', 2, '235878457845', '/v1/cases/20/01');
        shallowWrapper.find('a').at(0).props().onClick(event, '621', 2, '235878457845', '/v1/cases/20/01');
    });
    it('Without case notification', () => {
        cases = null;
        const shallowRender = shallow(
            <Notification
                cases={cases}
                preferences={preferences.common} action={{
                    getCaseDetails,
                    removeSelectedNotification }} />,
        );
        expect(shallowRender).to.exist;
    });
});
