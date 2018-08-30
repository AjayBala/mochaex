import React from 'react';
import { YodaDropdown } from 'yoda-fusion-site-components/lib/components/YodaDropdown/YodaDropdown';

// YodaDropdown - Class component that can be passed as template in TablePanel.
// Functional component that can be passed as template in TablePanel.
const CaseLink = props => <a href={`/case/${props.dataSource}`} activeClassName="active">{props.dataSource}</a>; //eslint-disable-line
const CaseColumn = [
    { id: 'caseId', name: 'Case ID', type: 'NUMBER', sortOrder: 'asc', template: CaseLink },
    { id: 'caseType', name: 'Case Type' },
    { id: 'createdDate', name: 'Created', type: 'DATE' },
    { id: 'age', name: 'Age' },
    { id: 'priority', name: 'Priority', template: YodaDropdown, props: { defaultValue: 'Select' }, noSort: true },
    { id: 'caseStatus', name: 'Case Status', noSort: true },
    { id: 'extensionStatus', name: 'Extension Status', type: 'NUMBER' },
    { id: 'releaseDate', name: 'Release Date', type: 'DATE' },
];

export default CaseColumn;
