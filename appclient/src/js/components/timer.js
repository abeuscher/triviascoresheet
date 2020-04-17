import React, { Component } from 'react'

export default class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time_left: {}
        }
        

    }
    componentDidMount() {
        this.timerID = setInterval(this.calculateTimeLeft, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }    
    calculateTimeLeft = () => {
        const difference = +new Date(this.props.start_time) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }

        this.state.time_left = timeLeft
        this.setState(this.state)
    };
    dateString = m => {
        m = new Date(m)
        return m.getUTCFullYear() + "/" +
            ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" +
            ("0" + m.getUTCDate()).slice(-2) + " " +
            ("0" + m.getUTCHours()).slice(-2) + ":" +
            ("0" + m.getUTCMinutes()).slice(-2) + ":" +
            ("0" + m.getUTCSeconds()).slice(-2);
    }
    render() {
        return pug`
            .timer-bucket
                h2 Game Starts in:
                .timer
                    .days=this.state.time_left.days + " days"
                    .hours=this.state.time_left.hours + " hours"
                    .minutes=this.state.time_left.minutes + " minutes"
                    .seconds=this.state.time_left.seconds + " seconds"
                p="Game Start Time:"+this.dateString(this.props.start_time) 
        `
    }
}
