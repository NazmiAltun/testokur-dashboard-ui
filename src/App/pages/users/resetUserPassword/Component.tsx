import React from 'react';
import * as _ from 'lodash';
import { Grid } from '@material-ui/core';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { PasswordField, MessageBox, InteractiveButtonWithSpinner } from '../../../components';
import { snakeToCamel } from '../../../helpers';
import { connect } from 'react-redux';
import AppState from '../../../AppState';
import { requestResetPassword } from './actions';
import { User } from '../types';

interface ComponentProps {
  classes?: any;
  user: User;
}

interface PropsFromState {
  loading: boolean;
  success: boolean;
  message?: string;
}

interface State {
  formData: any;
}

interface PropsFromDispatch {
  requestResetPassword: typeof requestResetPassword;
}

type Props = PropsFromState & PropsFromDispatch & ComponentProps;

class Component extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      formData: {
        newPassword: '123456',
        newPasswordConfirm: '123456',
      },
    };
  }
  public componentDidMount() {
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      const { formData } = this.state;
      if (value !== formData.newPassword) {
        return false;
      }
      return true;
    });
  }
  public componentDidUpdate() {
    if (this.props.success && !_.isNil(this.props.message)) {
      if (this.state.formData.newPassword !== '') {
        this.setState({
          formData: {
            newPassword: '',
            newPasswordConfirm: '',
          },
        });
      }
    }
  }

  public render() {
    const { formData } = this.state;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <ValidatorForm onSubmit={this.handleSubmit}>
            {!this.props.success && !_.isNil(this.props.message) ? (
              <MessageBox variant="error" message={this.props.message} />
            ) : (
              <></>
            )}
            {this.props.success && !_.isNil(this.props.message) ? (
              <MessageBox variant="success" message={this.props.message} />
            ) : (
              <></>
            )}
            <PasswordField
              label="Yeni Parola"
              onChange={this.handleChange}
              name="new-password"
              value={formData.newPassword}
            />
            <PasswordField
              label="Yeni Parola Tekrar"
              onChange={this.handleChange}
              name="new-password-confirm"
              validators={['isPasswordMatch']}
              errorMessages={['Yeni parola tekrari ile ayni olmali']}
              value={formData.newPasswordConfirm}
            />
            <InteractiveButtonWithSpinner loading={this.props.loading} />
          </ValidatorForm>
        </Grid>
      </Grid>
    );
  }

  private handleChange = (event: any) => {
    const { formData } = this.state;
    formData[snakeToCamel(event.target.name)] = event.target.value;
    this.setState({ formData });
  };
  private handleSubmit = () => {
    this.props.requestResetPassword(this.props.user.subjectId, this.state.formData.newPassword);
  };
}

function mapStateToProps({ resetUserPassword }: AppState, ownProps: ComponentProps) {
  return {
    user: ownProps.user,
    loading: resetUserPassword.loading,
    success: resetUserPassword.success,
    message: resetUserPassword.message,
  };
}

const mapDispatchToProps = {
  requestResetPassword,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component as any);
