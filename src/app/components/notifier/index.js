// @flow

import React from "react";
import { connect } from "react-redux";
import { css } from "emotion";

type Props = {
    events: Array<VizEvent>,
    agents: Array<any>,
};

const notifierClass = css`
    position: absolute;
    top: 60px;
    right: 10px;
    color: white;
    text-align: right;
    list-style-type: none;
    opacity: 0.75;
`;

const Notifier = ({ events, agents }: Props) => {

    const agentById = (id: string) => {
        return (agents.find(a => a.id == id))||null;
    };

    return (
        <ul className={notifierClass}>
            {events.map((event: VizEvent) => {

                let msg = null;

                switch(event.Subject) {
                    case "beenfragged": {
                        const who = agentById(event.Payload.who);
                        const by = agentById(event.Payload.by);
                        if(!who || !by) return;

                        msg = (<span><strong>{who.name}</strong> has been fragged by <strong>{by.name}</strong>.</span>);
                        break;
                    }
                    case "respawned": {
                        const who = agentById(event.Payload.who);
                        if (!who) return;

                        msg = (<span><strong>{who.name}</strong> has respawned.</span>);
                    }
                }

                return (
                    <li key={event.Id}>{msg}</li>
                );
            })}
        </ul>
    );
};

const mapStateToProps = (state) => ({
    agents: state.agents,
    events: state.game.events,
});

export default connect(
    mapStateToProps,
)(Notifier);
