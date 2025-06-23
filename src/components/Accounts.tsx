import React, { useRef, useState } from "react";
import { FormattedNumber } from "react-intl";
import {
  Button,
  ControlLabel,
  FormGroup,
  FormControl,
  Table,
  Popover,
  OverlayTrigger,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import useAccounts from "../hooks/useAccounts";
import useAccountSeries from "../hooks/useAccountSeries";
import AccountDetail from "../components/AccountDetail";
import { useUpdateAccounts } from "../hooks/useUpdateAccounts";
import { Account } from "../data/Account";

interface AccountRowProps {
  account: Account;
  onClick: (account: Account) => void;
}

interface AccountsProps {}

function Accounts(props: AccountsProps): JSX.Element | null {
  const { uploadFileToAccount, createAccount } = useUpdateAccounts();
  const [newName, setNewName] = useState<string>("");
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const overlayRef = useRef<any>(null);
  const { isLoading, data: accounts } = useAccounts();
  const { isLoading: isSeriesLoading, data: accountSeries } =
    useAccountSeries(currentAccount?.id);
  const uploadInProgress = false,
    uploadProgress = 0,
    uploadResult = null;

  const handleCreateAccount = (): void => {
    createAccount(newName);
    setNewName("");
    if (overlayRef.current !== null) {
      overlayRef.current.hide();
    }
  };

  const handleUploadToAccount = (account: Account, file: File): void => {
    uploadFileToAccount(account, file);
  };

  if (isLoading) {
    return null;
  }

  const popoverCreate = (
    <Popover id="popover-create" title="Add account">
      <FormGroup controlId="name">
        <ControlLabel>Name: </ControlLabel>
        <FormControl
          type="text"
          onChange={(event: any) => {
            setNewName(event.target.value);
          }}
          value={newName}
        />
      </FormGroup>
      <Button onClick={handleCreateAccount}>Add</Button>
    </Popover>
  );

  const AccountRow = ({ account, onClick }: AccountRowProps): JSX.Element => (
    <tr onClick={() => onClick(account)} key={account.id}>
      <td>{account.name}</td>
      <td className="text-right">
        <FormattedNumber
          value={account.balance || 0.0}
          style={"currency"}
          currency={"AUD"}
        />
      </td>
    </tr>
  );

  return (
    <div>
      <h3>
        Accounts
        <OverlayTrigger
          trigger="click"
          rootClose
          placement="right"
          overlay={popoverCreate}
          ref={overlayRef}
        >
          <Button bsSize="small">
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </OverlayTrigger>
      </h3>
      <Table>
        <tbody>
          {accounts && [...accounts.values()].map((account) => {
            return (
              <AccountRow
                account={account}
                onClick={setCurrentAccount}
                key={account.id}
              />
            );
          })}
        </tbody>
      </Table>
      <div>
        {currentAccount && (
          <AccountDetail
            account={currentAccount}
            accountSeries={accountSeries}
            uploadToAccount={handleUploadToAccount}
            uploadInProgress={uploadInProgress}
            uploadProgress={uploadProgress}
            uploadResult={uploadResult}
          />
        )}
      </div>
    </div>
  );
}

export default Accounts;