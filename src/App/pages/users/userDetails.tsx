import React from 'react';
import * as _ from 'lodash';
import { RouteComponentProps } from 'react-router';
import { Grid, Avatar, withStyles, Divider, Tabs, Tab, Button, Paper, Box } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { connect } from 'react-redux';
import { styles } from './styles';
import { UserStatus } from './UserStatus';
import { User } from '../home/types';
import AppState from '../../AppState';
import LicenseDetails from './LicenseDetails';
import { SmsDetails } from './smsDetails';
import PersonalDetails from './personalDetails';
import { ResetUserPassword } from './resetUserPassword';
import { ConfirmationDialog } from '../../components';

interface MatchParams {
  userName: string;
}

interface ComponentProps extends RouteComponentProps<MatchParams> {
  classes: any;
}

interface PropsFromState {
  user: User;
}
interface State {
  tabIndex: number;
  openUpdateUserDialog: boolean;
  user: User;
}

type Props = PropsFromState & ComponentProps;

class Component extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      tabIndex: 0,
      openUpdateUserDialog: false,
      user: this.props.user,
    };
  }

  private handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    this.setState((prevState) => ({
      ...prevState,
      tabIndex: newValue,
    }));
  };

  private setUpdateUserDialogState = (display: boolean) => {
    this.setState((prevState) => ({
      ...prevState,
      openUpdateUserDialog: display,
    }));
  };

  private handleChange = (newUser: User) => {
    this.setState((prevState) => ({
      ...prevState,
      user: newUser,
    }));
  };

  private updateUser = () => {
    this.setUpdateUserDialogState(false);
  };

  public render() {
    return (
      <div>
        <div className={this.props.classes.root}>
          <Grid container justify="center" alignItems="center">
            <Avatar className={this.props.classes.avatar}>
              <PersonIcon />
            </Avatar>
            <h3>{this.props.user.userName}</h3>
            <UserStatus active={this.state.user.active} expirationDate={this.state.user.expiryDateUtc} />
          </Grid>
          <Divider />
          <Tabs
            value={this.state.tabIndex}
            onChange={this.handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="LISANS BILGILERI" />
            <Tab label="KISISEL BILGILER" />
            <Tab label="DIGER BILGILER" />
            <Tab label="PAROLA DEGISTIR" />
          </Tabs>
          {this.state.tabIndex === 0 && (
            <LicenseDetails
              user={this.state.user}
              onChange={(u: User) => this.setState((prevState) => ({ ...prevState, user: u }))}
              onActivated={() => {
                var d = new Date();
                var year = d.getFullYear();
                var month = d.getMonth();
                var day = d.getDate();
                this.setState((prevState) => ({
                  ...prevState,
                  user: {
                    ...prevState.user,
                    expiryDateUtc: new Date(year + 1, month, day),
                    active: true,
                  },
                }));
              }}
            />
          )}
          {this.state.tabIndex === 1 && (
            <PersonalDetails
              user={this.props.user}
              onChange={(u: User) => this.setState((prevState) => ({ ...prevState, user: u }))}
            />
          )}
          {this.state.tabIndex === 2 && <SmsDetails user={this.props.user} />}
          {this.state.tabIndex === 3 && <ResetUserPassword user={this.props.user} />}
        </div>
        {this.state.tabIndex !== 3 && this.state.tabIndex !== 2 && (
          <Box marginTop={2}>
            <Grid container justify="flex-start">
              <Grid item xs={6}>
                <Paper>
                  <Button
                    type="button"
                    onClick={() => this.setUpdateUserDialogState(true)}
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    Degisiklikleri Kaydet
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
        <ConfirmationDialog
          open={this.state.openUpdateUserDialog}
          title={'Guncelleme Onay'}
          message={'Yaptiginiz degisikliler kaydedilecektir. Onayliyor musunuz?'}
          onNoClick={() => this.setUpdateUserDialogState(false)}
          onYesClick={() => this.updateUser()}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ users }: AppState, { match }: ComponentProps) => ({
  user: _.head(_.filter(users.data, { userName: match.params.userName })),
});

export default connect(mapStateToProps)(withStyles(styles as any, { withTheme: true })(Component as any) as any);
