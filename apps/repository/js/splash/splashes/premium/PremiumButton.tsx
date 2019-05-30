import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import {Nav} from '../../../../../../web/js/ui/util/Nav';
import {UserInfo} from '../../../../../../web/js/apps/repository/auth_handler/AuthHandler';
import {AccountActions} from '../../../../../../web/js/accounts/AccountActions';
import {Logger} from '../../../../../../web/js/logger/Logger';
import {NullCollapse} from '../../../../../../web/js/ui/null_collapse/NullCollapse';

const log = Logger.create();

export class PremiumButton extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        const {to, from} = this.props;

        // true when this is the current plan and we do not need to show the
        // button
        const currentPlan = to === from;

        const {email} = this.props.userInfo!;

        // true if we're BUYING a new plan...
        const buy = from === 'free';

        const text = buy ? "Buy" : "Change";

        const buyHandler = () => {
            // if we're buying a NEW product go ahead and redirect us to
            // stripe and use their BUY package.  This is better than embedding
            // the stripe SDK and also stripe ALSO needs to run over HTTPS
            Nav.openLinkWithNewTab(`https://getpolarized.io/pay.html?email=${email}&plan=${to}`);
        };

        const changeHandler = () => {

            console.log("Changing plan to: " + to);

            AccountActions.changePlan(to)
                .catch(err => log.error("Unable to upgrade plan: ", err));
        };

        const handler = buy ? buyHandler : changeHandler;

        return (

            <NullCollapse open={! currentPlan}>

                <Button color="secondary"
                        onClick={() => handler()}>

                    {text}

                </Button>

            </NullCollapse>

        );
    }

}

export interface IProps {
    readonly from: Plan;
    readonly to: Plan;
    readonly userInfo?: UserInfo;

}

export interface IState {

}

export type Plan = 'free' | 'bronze' | 'silver' | 'gold';
