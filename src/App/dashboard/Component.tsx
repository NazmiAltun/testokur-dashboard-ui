import * as React from 'react';
import { CssBaseline } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { SideMenu, TopAppBar } from '../navigation';
import { styles } from './style';
import { changePassword } from '../pages/changePassword';
import { Route, Switch } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { Home } from '../pages/home';
import { UserDetails, UserList } from '../pages/users';

interface State {
  open: boolean;
}
interface Props {
  classes: any;
}

class Component extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      open: true,
    };
  }
  private handleDrawerOpen = () => {
    this.setState({ open: true });
  };
  private handleDrawerClose = () => {
    this.setState({ open: false });
  };
  private Footer = () => {
    return (
      <Typography className={this.props.classes.footer} variant="body2" color="textSecondary" align="center">
        {'TestOkur yonetim paneli. Tum haklari saklidir. Copyright © 2019.'}
      </Typography>
    );
  };
  private Body = () => {
    return (
      <div className={this.props.classes.root}>
        <CssBaseline />
        <TopAppBar open={this.state.open} handleDrawerOpen={this.handleDrawerOpen} />
        <SideMenu open={this.state.open} handleDrawerClose={this.handleDrawerClose} />
        <main className={this.props.classes.content}>
          <div className={this.props.classes.toolbar} />
          <Switch>
            <Route path="/" exact={true} component={Home} />
            <Route path="/changePassword" exact={true} component={changePassword} />
            <Route path="/users" exact={true} component={UserList} />
            <Route path="/users/:userName" exact={true} component={UserDetails} />
          </Switch>
          {this.Footer()}
        </main>
      </div>
    );
  };

  public render() {
    return this.Body();
  }
}

export default withStyles(styles as any, { withTheme: true })(Component as any) as any;
