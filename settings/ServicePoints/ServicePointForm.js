import { cloneDeep } from 'lodash';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Pane from '@folio/stripes-components/lib/Pane';
import TextField from '@folio/stripes-components/lib/TextField';
import TextArea from '@folio/stripes-components/lib/TextArea';
import Select from '@folio/stripes-components/lib/Select';
import Button from '@folio/stripes-components/lib/Button';
import Paneset from '@folio/stripes-components/lib/Paneset';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import IfPermission from '@folio/stripes-components/lib/IfPermission';
import IconButton from '@folio/stripes-components/lib/IconButton';
import Icon from '@folio/stripes-components/lib/Icon';

// eslint-disable-next-line import/no-unresolved
import ConfirmationModal from '@folio/stripes-components/lib/structures/ConfirmationModal';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import { Accordion, ExpandAllButton } from '@folio/stripes-components/lib/Accordion';
import ViewMetaData from '@folio/stripes-smart-components/lib/ViewMetaData';

import stripesForm from '@folio/stripes-form';
import { Field } from 'redux-form';

class ServicePointForm extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      connect: PropTypes.func.isRequired,
      intl: PropTypes.object.isRequired,
    }).isRequired,
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onRemove: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.save = this.save.bind(this);
    this.beginDelete = this.beginDelete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.handleExpandAll = this.handleExpandAll.bind(this);
    this.handleSectionToggle = this.handleSectionToggle.bind(this);
    this.cViewMetaData = props.stripes.connect(ViewMetaData);

    this.state = {
      confirmDelete: false,
      sections: {
        generalSection: true,
      },
    };
  }

  save(data) {
    this.props.onSave(data);
  }

  beginDelete() {
    this.setState({
      confirmDelete: true,
    });
  }

  confirmDelete(confirmation) {
    const servicePoint = this.props.initialValues;
    if (confirmation) {
      this.props.onRemove(servicePoint);
    } else {
      this.setState({ confirmDelete: false });
    }
  }

  translate(id) {
    return this.props.stripes.intl.formatMessage({
      id: `ui-organization.settings.servicePoints.${id}`
    });
  }

  addFirstMenu() {
    return (
      <PaneMenu>
        <IconButton
          id="clickable-close-service-point"
          onClick={this.props.onCancel}
          icon="closeX"
          title="close"
          aria-label={this.translate('closeServicePointDialog')}
        />
      </PaneMenu>
    );
  }

  saveLastMenu() {
    const { pristine, submitting, initialValues } = this.props;
    const { confirmDelete } = this.state;
    const edit = initialValues && initialValues.id;
    const saveLabel = edit ? this.translate('saveAndClose') : this.translate('createServicePoint');

    return (
      <PaneMenu>
        {edit &&
          <IfPermission perm="settings.organization.enabled">
            <Button
              id="clickable-delete-service-point"
              title={this.translate('delete')}
              buttonStyle="danger"
              onClick={this.beginDelete}
              disabled={confirmDelete}
              marginBottom0
            >{this.translate('delete')}
            </Button>
          </IfPermission>
        }
        <Button
          id="clickable-save-service-point"
          type="submit"
          title={this.translate('saveAndClose')}
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
          disabled={(pristine || submitting)}
        >{saveLabel}
        </Button>
      </PaneMenu>
    );
  }

  handleSectionToggle({ id }) {
    this.setState((curState) => {
      const newState = cloneDeep(curState);
      newState.sections[id] = !newState.sections[id];
      return newState;
    });
  }

  handleExpandAll(sections) {
    this.setState((curState) => {
      const newState = cloneDeep(curState);
      newState.sections = sections;
      return newState;
    });
  }

  renderPaneTitle() {
    const { initialValues } = this.props;
    const servicePoint = initialValues || {};

    if (servicePoint.id) {
      return (<div><Icon size="small" icon="edit" /><span>{`${this.translate('edit')}: ${servicePoint.name}`}</span></div>);
    }

    return this.translate('new');
  }

  render() {
    const { stripes, handleSubmit, initialValues } = this.props;
    const servicePoint = initialValues || {};
    const { confirmDelete, sections } = this.state;
    const disabled = !stripes.hasPerm('settings.organization.enabled');
    const name = servicePoint.name || this.translate('untitledServicePoint');
    const confirmationMessage = <FormattedMessage id="ui-organization.settings.servicePoints.deleteServicePointMessage" values={{ name: <strong>{name}</strong> }} />;
    const selectOptions = [
      { label: 'Yes', value: true },
      { label: 'No', value: false }
    ];

    return (
      <form id="form-service-point" onSubmit={handleSubmit(this.save)}>
        <Paneset isRoot>
          <Pane defaultWidth="100%" firstMenu={this.addFirstMenu()} lastMenu={this.saveLastMenu()} paneTitle={this.renderPaneTitle()}>
            <Row end="xs">
              <Col xs>
                <ExpandAllButton accordionStatus={sections} onToggle={this.handleExpandAll} />
              </Col>
            </Row>
            <Accordion
              open={sections.generalSection}
              id="generalSection"
              onToggle={this.handleSectionToggle}
              label={this.translate('generalInformation')}
            >
              {servicePoint.metadata && servicePoint.metadata.createdDate &&
                <Row>
                  <Col xs={12}>
                    <this.cViewMetaData metadata={servicePoint.metadata} />
                  </Col>
                </Row>
              }
              <Row>
                <Col xs={4}>
                  <Field label={`${this.translate('name')} *`} name="name" id="input-service-point-name" component={TextField} autoFocus required fullWidth rounded disabled={disabled} />
                  <Field label={`${this.translate('code')} *`} name="code" id="input-service-point-code" component={TextField} fullWidth rounded disabled={disabled} />
                  <Field label={`${this.translate('discoveryDisplayName')} *`} name="discoveryDisplayName" id="input-service-point-code" component={TextField} fullWidth rounded disabled={disabled} />
                </Col>
              </Row>
              <Row>
                <Col xs={8}>
                  <Field label={this.translate('description')} name="description" id="input-service-description" component={TextArea} fullWidth rounded disabled={disabled} />
                </Col>
              </Row>
              <Row>
                <Col xs={4}>
                  <Field label={this.translate('shelvingLagTime')} name="shelvingLagTime" id="input-service-shelvingLagTime" component={TextField} fullWidth rounded disabled={disabled} />
                </Col>
              </Row>
              <Row>
                <Col xs={2}>
                  <Field label={this.translate('pickupLocation')} name="pickupLocation" id="input-service-pickupLocation" component={Select} dataOptions={selectOptions} rounded disabled={disabled} />
                  <Field label={this.translate('feeFineOwner')} name="feeFineOwner" id="input-service-feeFineOwner" component={Select} dataOptions={selectOptions} rounded disabled={disabled} />
                </Col>
              </Row>
            </Accordion>
            <ConfirmationModal
              open={confirmDelete}
              heading={this.translate('deleteServicePoint')}
              message={confirmationMessage}
              onConfirm={() => { this.confirmDelete(true); }}
              onCancel={() => { this.confirmDelete(false); }}
              confirmLabel={this.translate('delete')}
            />
          </Pane>
        </Paneset>
      </form>
    );
  }
}

export default stripesForm({
  form: 'servicePointForm',
  navigationCheck: true,
  enableReinitialize: false,
})(ServicePointForm);