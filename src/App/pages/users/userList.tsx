import * as _ from 'lodash';
import dateformat from 'dateformat';
import React, { useEffect, useState } from 'react';
import { withStyles, CircularProgress, Box } from '@material-ui/core';
import { connect } from 'react-redux';
import MaterialTable from 'material-table';
import { styles } from './styles';
import { User } from '../home/types';
import AppState from '../../AppState';
import { tableIcons } from '../../components';
import Sms from '@material-ui/icons/Sms';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';

import { fetchUsers } from '../home/actions';
import { SendSmsDialog } from './SendSmsDialog';
import { webApi } from '../../helpers';
import { AddSmsDialog } from './smsDetails/AddSmsDialog';

interface ComponentProps {
  classes: any;
}

interface PropsFromState {
  users: User[];
  loading: boolean;
}

interface PropsFromDispatch {
  fetchUsers: typeof fetchUsers;
}

type Props = PropsFromState & ComponentProps & PropsFromDispatch;

/* eslint-disable react/display-name */
const component: React.FC<Props> = (props) => {
  useEffect(() => {
    props.fetchUsers();
  }, []);
  const [smsDialogOpen, setSmsDialogOpen] = useState(false);
  const [addSmsCreditDialogOpen, setAddSmsCreditDialogOpen] = useState(false);
  const [user, setUser] = useState<User>();

  const handleSendSms = async (body: string): Promise<boolean> => {
    await webApi.post('/api/v1/sms/send-admin', { receiver: _.get(user, 'phone', ''), body: body });
    return true;
  };

  const handleAddCredit = async (amount: number) => {
    setAddSmsCreditDialogOpen(false);
    await webApi.post('/api/v1/sms/add-credits', { userId: _.get(user, 'id', ''), amount: amount });
    props.fetchUsers();
  };

  return props.loading ? (
    <Box display="flex" justifyContent="center">
      <CircularProgress size={120} />
    </Box>
  ) : (
    <div>
      <MaterialTable
        icons={tableIcons}
        title="KULLANICILAR"
        columns={[
          { title: 'E-Posta', field: 'userName' },
          {
            title: 'Ad Soyad',
            field: 'firstName',
            render: (rowData) => (
              <span>
                {rowData.firstName} {rowData.lastName}
              </span>
            ),
          },
          {
            title: 'Şehir-İlçe',
            field: 'cityName',
            render: (rowData) => (
              <span>
                {rowData.cityName} {rowData.districtName}
              </span>
            ),
          },
          {
            title: 'Bitiş Tarihi',
            field: 'expiryDateUtc',
            render: (rowData) => <span>{dateformat(rowData.expiryDateUtc, 'dd.mm.yyyy HH:MM')}</span>,
          },
          {
            title: 'Sms Bakiye',
            field: 'smsBalance',
          },
        ]}
        data={props.users}
        localization={{
          body: {
            emptyDataSourceMessage: 'Gösterilecek kayıt yok',
          },
          header: {
            actions: 'Islemler',
          },
          toolbar: {
            searchTooltip: 'Arama',
            searchPlaceholder: 'Arama',
          },
          pagination: {
            labelRowsSelect: 'satır',
            labelDisplayedRows: '{count} satırdan {from}-{to} arası',
            firstTooltip: 'İlk Sayfa',
            previousTooltip: 'Önceki Sayfa',
            nextTooltip: 'Sonraki Sayfa',
            lastTooltip: 'Son Sayfa',
          },
        }}
        actions={[
          {
            icon: () => <Sms />,
            tooltip: 'Sms Gonder',
            onClick: (event, rowData) => {
              setUser(rowData);
              setSmsDialogOpen(true);
            },
          },
          {
            icon: () => <AddCircleOutline />,
            tooltip: 'Sms Kredisi Ekle',
            onClick: (event, rowData) => {
              setUser(rowData);
              setAddSmsCreditDialogOpen(true);
            },
          },
        ]}
        options={{
          actionsColumnIndex: -1,
        }}
      />
      <SendSmsDialog
        onSubmit={handleSendSms}
        open={smsDialogOpen}
        onClose={() => setSmsDialogOpen(false)}
        phone={_.get(user, 'phone', '')}
      />
      <AddSmsDialog
        open={addSmsCreditDialogOpen}
        onSubmit={handleAddCredit}
        onClose={() => setAddSmsCreditDialogOpen(false)}
      />
    </div>
  );
};

const mapStateToProps = ({ users }: AppState) => ({
  users: users.data,
  loading: users.loading,
});

const mapDispatchToProps = {
  fetchUsers,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles as any, { withTheme: true })(component as any) as any);
