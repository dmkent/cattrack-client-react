import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import {
  Button,
  FormLabel,
  FormGroup,
  FormControl,
  Table,
  Popover,
  OverlayTrigger,
} from "react-bootstrap";
import { FormattedNumber } from "react-intl";

import { AccountDetail } from "../components/AccountDetail";
import { Account } from "../data/Account";
import { useAccountSeries } from "../hooks/useAccountSeries";
import { useAccounts } from "../hooks/useAccounts";
import { useUpdateAccounts } from "../hooks/useUpdateAccounts";

interface AccountRowProps {
  account: Account;
  onClick: (account: Account) => void;
}

export function Accounts(): JSX.Element | null {
  const { createAccount } = useUpdateAccounts();
  const [newName, setNewName] = useState<string>("");
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [showCreatePopover, setShowCreatePopover] = useState<boolean>(false);
  const { isLoading, data: accounts } = useAccounts();
  const { data: accountSeries } = useAccountSeries(currentAccount?.id);

  const handleCreateAccount = (): void => {
    createAccount(newName);
    setNewName("");
    setShowCreatePopover(false);
  };

  if (isLoading) {
    return null;
  }

  const popoverCreate = (
    <Popover id="popover-create" title="Add account">
      <FormGroup controlId="name">
        <FormLabel>Name: </FormLabel>
        <FormControl
          type="text"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNewName(event.target.value);
          }}
          value={newName}
        />
      </FormGroup>
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={handleCreateAccount}
      >
        Add
      </Button>
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
      <td>
        {account.last_transaction &&
          account.last_transaction.toLocaleDateString()}
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
          show={showCreatePopover}
          onToggle={setShowCreatePopover}
        >
          <Button variant="outline-secondary" size="sm">
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </OverlayTrigger>
      </h3>
      <Table>
        <tbody>
          {accounts &&
            accounts.map((account) => {
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
          />
        )}
      </div>
    </div>
  );
}
