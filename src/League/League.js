import { useState, useEffect } from "react";
import HelperDropdown from "../HelperDropdown/HelperDropdown.js";
import EmptyState from "../EmptyState/EmptyState.js";
import HelperTable from "../HelperTable/HelperTable.js";
import HelperModal from "../HelperModal/HelperModal.js";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './League.css';

const League = () => {
    const [leagues, setLeagues] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [leagueStandings, setLeagueStandings] = useState([]);
    const [players, setPlayers] = useState({ team_logo: '', playerInfo: [] });
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');


    const modalHeading = 'Team Players';
    const columnHeaders = [{ label: 'Position', identifier: 'position', isSortable: true, isClickable: false },
    { label: 'Team-Name', identifier: 'name', isSortable: true, isClickable: true },
    { label: 'Played', identifier: 'played', isSortable: true, isClickable: false },
    { label: 'Won', identifier: 'won', isSortable: true, isClickable: false },
    { label: 'Drawn', identifier: 'drawn', isSortable: true, isClickable: false },
    { label: 'Lost', identifier: 'lost', isSortable: true, isClickable: false },
    { label: 'Goal', identifier: 'goal', isSortable: true, isClickable: false },
    { label: 'Difference', identifier: 'difference', isSortable: true, isClickable: false },
    { label: 'Points', identifier: 'points', isSortable: true, isClickable: false }];
    const profileHeaders = ['Name', 'Nationality', 'Position', 'Rating', 'Yellow Cards', 'Red Cards', 'Appearances'];

    //user events
    const handleDropdownSelection = async (selectedIndex, name) => {
        if (name === "league") {
            let seasonsData = await fetchSeasonsData();
            if (seasonsData.error) {
                setError(seasonsData.error.message);
            }
            else {
                const seasonsOptions = seasonsData.data
                    .map((element) => [element.name, element.league_id, element.id])
                    .filter((element) => element[1] == selectedIndex)
                    .map((element) => {
                        return { name: element[0], id: element[2] };
                    });
                setSeasons(seasonsOptions);
                setError('');
            }
        } else {
            const leagueStandingsTableData = await fetchLeagueStandings(
                selectedIndex
            );
            let tables = [];
            let index = 0;
            if (leagueStandingsTableData.error) {
                setError(leagueStandingsTableData.error.message);
            }
            else {
                leagueStandingsTableData.data.forEach((stage) => {
                    // remove hard coding and refactor by recursively traversing object to find the last data(find objects without 'standings' as child)?
                    if (stage.name === '2nd Phase' || stage.name === 'Relegation Round') {
                        let phaseTwoGroups = stage.standings.data;
                        return phaseTwoGroups.map(group => {
                            let teams = group.standings.data;
                            let tableInfo = teams.map(team => {
                                return {
                                    id: team.team_id,
                                    position: team.position,
                                    name: team.team_name,
                                    played: team.overall.games_played,
                                    won: team.overall.won,
                                    drawn: team.overall.draw,
                                    lost: team.overall.lost,
                                    goal: team.overall.goals_scored,
                                    difference: team.total.goal_difference,
                                    points: team.total.points,
                                };
                            })
                            tables = [...tables, { table_id: index++, table_header: stage.name + ' -- ' + group.name, tableInfo: tableInfo }];
                        })
                    } else {
                        let tableInfo = stage.standings.data.map(team => {
                            return {
                                id: team.team_id,
                                position: team.position,
                                name: team.team_name,
                                played: team.overall.games_played,
                                won: team.overall.won,
                                drawn: team.overall.draw,
                                lost: team.overall.lost,
                                goal: team.overall.goals_scored,
                                difference: team.total.goal_difference,
                                points: team.total.points,
                            };
                        })
                        tables = [...tables, { table_id: index++, table_header: stage.name, tableInfo: tableInfo }];
                    }
                })
                setLeagueStandings(tables);
                setError('');
            }

        }
    };

    const handleCellClick = async (selectedTeamId) => {
        const players = await fetchTeamPlayers(selectedTeamId);
        if (players.error) {
            setError(players.error.message);
        }
        else {
            const team_logo = players.data.logo_path;
            const playerIds = players.data.squad.data.map(element => element.player_id);
            const playersScoreCards = players.data.squad.data.map(element => { return { rating: element.rating, yellow_cards: element.yellowcards, red_cards: element.redcards, appearances: element.appearances } });
            const playerInfoFromApi = await Promise.all(playerIds.map(async (element) => {
                let response = await fetchPlayerInfo(element);
                if(response.error){
                    setError(response.error.message);
                }
                return response;
            }));
            const playerDisplayInfo = playerInfoFromApi.map((element, index) => {
                return {
                    team_id: element.data.team_id,
                    score_card: playersScoreCards[index],
                    name: element.data.display_name,
                    nationality: element.data.nationality,
                    image: element.data.image_path ? element.data.image_path : 'https://cdn.sportmonks.com/images/soccer/players/2/1452162.png',
                    position: element.data.position_id,
                    id: element.data.player_id
                }

            });
            setPlayers({ team_logo: team_logo, playerInfo: playerDisplayInfo });
            setShowModal(true);
        }
    }

    // helper Functions
    /*TODO :Add spinner so the user doesnt have to wait on the screen */
    /*TODO : Create Error State component */
    const fetchPlayerInfo = async (playerId) => {
        try {
            const response = await fetch(`https://soccer.sportmonks.com/api/v2.0/players/${playerId}?api_token=HOLCAStI6Z0OfdoPbjdSg5b41Q17w2W5P4WuoIBdC66Z54kUEvGWPIe33UYC`);
            return await response.json();
        }
        catch (err) {
            console.log(err);
            setError('an Error occured, please try again later');
        }
    }
    const fetchSeasonsData = async () => {
        try {
            const seasonsData = await fetch(
                "https://soccer.sportmonks.com/api/v2.0/seasons?api_token=HOLCAStI6Z0OfdoPbjdSg5b41Q17w2W5P4WuoIBdC66Z54kUEvGWPIe33UYC"
            );
            return await seasonsData.json();
        }
        catch (err) {
            console.log(err);
            setError('an Error occured, please try again later');
        }
    };

    const fetchLeagueStandings = async (season_id) => {
        try {
            const leagueStandings = await fetch(
                `https://soccer.sportmonks.com/api/v2.0/standings/season/${season_id}?api_token=HOLCAStI6Z0OfdoPbjdSg5b41Q17w2W5P4WuoIBdC66Z54kUEvGWPIe33UYC`
            );
            return await leagueStandings.json();
        }
        catch (err) {
            console.log(err);
            setError('an Error occured, please try again later');
        }
    };

    const fetchTeamPlayers = async (id) => {
        try {
            const teamPlayersData = await fetch(`https://soccer.sportmonks.com/api/v2.0/teams/${id}?api_token=HOLCAStI6Z0OfdoPbjdSg5b41Q17w2W5P4WuoIBdC66Z54kUEvGWPIe33UYC&include=squad`);
            return await teamPlayersData.json();
        }
        catch (err) {
            console.log(err);
            setError('an Error occured, please try again later');
        }
    }

    //use-effect :Load initial data
    useEffect(() => {
        try {
            async function fetchLeagues() {
                const response = await fetch(
                    "https://soccer.sportmonks.com/api/v2.0/leagues?api_token=HOLCAStI6Z0OfdoPbjdSg5b41Q17w2W5P4WuoIBdC66Z54kUEvGWPIe33UYC"
                );
                const responseJson = await response.json();
                const leaguesData = responseJson.data.map((element) => {
                    return { name: element.name, id: element.id };
                });
                setLeagues(leaguesData);
                setError('');
            }
            fetchLeagues();
        }
        catch (err) {
            console.log(err);
            setError('an Error occured, please try again later');
        }

    }, []);

    return (
        <>
            <div className="league__main">
                {error !=='' ? <div className="league__error">{error}</div> : null}
                <section className="league__user-input">
                    <div className="league__user-input__dropdown">{leagues && <HelperDropdown
                        name="league"
                        options={leagues}
                        onSelection={handleDropdownSelection}
                    />}
                    </div>
                    <div className="league__user-input__dropdown">
                        {seasons && <HelperDropdown
                            name="season"
                            options={seasons}
                            onSelection={handleDropdownSelection}
                        />}
                    </div>
                </section>
                <section className="league__data-table">
                    {leagueStandings.length > 0 ? leagueStandings.map((table) => (<HelperTable key={table.table_id} columnHeaders={columnHeaders} tableHeader={table.table_header} tableData={table.tableInfo} onCellClick={handleCellClick} />)) : <EmptyState />}
                    <HelperModal className="player__profile-data" show={showModal} header={modalHeading} handleClose={() => setShowModal(false)}>
                        <Container>
                            <Row md={4}>
                                <Col md={3} lg={3} sm={3} xs={12}><img className="player__team-logo" src={players.team_logo} alt="team_logo" /></Col>
                                {players.playerInfo.map(element => (
                                    <Col key={element.id} md={3} lg={3} sm={3} xs={12}>
                                        <Row className="rowSpacing">
                                            <img className="player__profile-image" src={element.image} alt="player_image" />
                                            <Col md={12}><div> <span className="player__profile-data__label">{profileHeaders[0]} </span>: {element.name}</div></Col>
                                            <Col md={12}><div><span className="player__profile-data__label">{profileHeaders[1]}</span>:{element.nationality}</div></Col>
                                            <Col md={12}><div><span className="player__profile-data__label">{profileHeaders[2]}</span>: {element.position}</div></Col>
                                            <Col md={12}><div><span className="player__profile-data__label">{profileHeaders[3]} </span>: {element.score_card.rating ? element.score_card.rating : '--'}</div></Col>
                                            <Col md={12}><div><span className="player__profile-data__label">{profileHeaders[4]}</span> : {element.score_card.yellow_cards ? element.score_card.yellow_cards : '--'}</div></Col>
                                            <Col md={12}><div><span className="player__profile-data__label">{profileHeaders[5]} </span>: {element.score_card.red_cards ? element.score_card.red_cards : '--'}</div></Col>
                                            <Col md={12}><div><span className="player__profile-data__label">{profileHeaders[6]}</span>: {element.score_card.appearances ? element.score_card.appearances : '--'}</div></Col>
                                        </Row>
                                    </Col>

                                ))
                                }
                            </Row>
                        </Container>
                    </HelperModal>
                </section>
            </div>
        </>
    );
};

export default League;
