import React, {useRef, useState} from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import useAccounts from "../hooks/useAccounts";
import useAccountSeries from "../hooks/useAccountSeries";
import { createAccount, uploadToAccount } from "../client/account";
import AccountDetail from "../components/AccountDetail";

function Accounts(props) {
  const [newName, setNewName] = useState("")
  const [currentAccount, setCurrentAccount] = useState(null)
  const overlayRef = useRef(null)
  const {isLoading, data: accounts} = useAccounts()
  const {isAccountLoading, data: accountSeries} = useAccountSeries(currentAccount)
  const uploadInProgress = false, uploadProgress = 0, uploadResult = null

  const handleCreateAccount = () => {
    createAccount(newName)
    setNewName("")
    if (overlayRef.current !== null) {
      overlayRef.current.hide();
    }
  }

  const handleUploadToAccount = (file) => {
    uploadToAccount(currentAccount, file)
  }

  if (isLoading) {
    return null;
  }

  const popoverCreate = (
    <Popover id="popover-create" title="Add account">
      <FormGroup controlId="name">
        <ControlLabel>Name: </ControlLabel>
        <FormControl
          type="text"
          onChange={(event) => {
            setNewName(event.target.value);
          }}
          value={newName}
        />
      </FormGroup>
      <Button onClick={handleCreateAccount}>Add</Button>
    </Popover>
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
          {[...accounts.values()].map((account) => {
            return (
              <tr
                key={account.id}
                onClick={() => setCurrentAccount(account)}
              >
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
          })}
        </tbody>
      </Table>
      <div>
        {currentAccount &&
          <AccountDetail
            account={currentAccount}
            accountSeries={accountSeries}
            uploadToAccount={handleUploadToAccount}
            uploadInProgress={uploadInProgress}
            uploadProgress={uploadProgress}
            uploadResult={uploadResult} />}
      </div>
    </div>
  );
}

export default Accounts;
