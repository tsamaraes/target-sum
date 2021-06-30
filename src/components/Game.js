import React from 'react';
import RandomNumber from './RandomNumber';
import {View, Text, Button, StyleSheet} from 'react-native';
import shuffle from 'lodash.shuffle';

<script src="http://localhost:8097"></script>
class Game extends React.Component {
    randomNumbers = Array.from({length: this.props.randomNumberCount})
                    .map(() => 1 + Math.floor(10*Math.random()));

    target = this.randomNumbers.slice(0, this.props.randomNumberCount-2)
    .reduce((acc, curr) => acc+curr, 0);

    gameStatus = 'PLAYING';

    shuffledRandomNumbers = shuffle(this.randomNumbers);

    state = {
        selectedIds: [],
        remainingSeconds: this.props.initialSeconds
    };

    isNumberSelected = (numberIndex) => {
        return this.state.selectedIds.indexOf(numberIndex) >= 0;
    };

    selectNumber = (numberIndex) => {
        this.setState((prevState) => ({
            selectedIds: [...prevState.selectedIds, numberIndex]
        }));
    };

    componentDidMount() {
        this.intervalId = setInterval(() => {
            this.setState((prevState) => {
                return {remainingSeconds: prevState.remainingSeconds - 1};
            }, () => {
                if(this.state.remainingSeconds === 0) {
                    clearInterval(this.intervalId);
                }
            })
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        if(nextState.selectedIDs !== this.state.selectedIds || nextState.remainingSeconds === 0) {
            this.gameStatus = this.calcGameStatus(nextState);
            if(this.gameStatus !== "PLAYING") {
                clearInterval(this.intervalId);
            }
        }
    }

    calcGameStatus = (nextState) => {
        const sumSelected = nextState.selectedIds.reduce((acc, curr) => {
            return acc + this.shuffledRandomNumbers[curr];
        }, 0);
        console.log(sumSelected);
        if(nextState.remainingSeconds === 0) {
            return 'LOST';
        }
        if(sumSelected < this.target) {
            return 'PLAYING';
        }
        if(sumSelected === this.target) {
            return 'WON';
        }
        if(sumSelected > this.target) {
            return 'LOST';
        }
    };

    render() {
        const gameStatus = this.gameStatus;
        return (
            <View style={styles.container}>
                <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>{this.target}</Text>
                <View style={styles.randomContainer}>
                    {this.shuffledRandomNumbers.map((randomNumber, index) =>
                        <RandomNumber 
                        key={index} 
                        id={index}
                        number={randomNumber}
                        isDisabled={this.isNumberSelected(index) || gameStatus !== 'PLAYING'} 
                        onPress={this.selectNumber}
                        />
                    )}
                </View>
                <View style={styles.play}>
                    <Text style={{textAlign: 'center'}}>Remaining Time: {this.state.remainingSeconds}</Text>
                    {this.gameStatus !== 'PLAYING' 
                    && (<Text style={{textAlign: 'center', fontSize: 20, paddingTop: 10}}>{this.gameStatus}</Text>)}
                    {this.gameStatus !== 'PLAYING' && (<Button title="Play Again" onPress={this.props.onPlayAgain} />)}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        paddingTop: 80
    },
    target: {
        fontSize: 40,
        marginHorizontal: 50,
        textAlign: 'center'
    },
    randomContainer: {
        paddingTop: 20,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around'
    },
    num: {
        backgroundColor: '#c4f5f0',
        width: 100,
        marginVertical: 20,
        marginHorizontal: 30,
        textAlign: 'center',
        fontSize: 35,
    },
    STATUS_PLAYING: {
        backgroundColor: '#67c7f0',
    },
    STATUS_WON: {
        backgroundColor: '#56fc8b',
    },
    STATUS_LOST: {
        backgroundColor: 'red',
    },
    play: {
        paddingBottom: 80
    }
})

export default Game;