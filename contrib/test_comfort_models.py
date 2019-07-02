import comfort_models
import numpy as np
import pandas as pd


def test_comfAdaptiveComfortASH55():
    """ Test the SET function using the reference table from the ASHRAE 55 2017"""

    assert comfort_models.comfAdaptiveComfortASH55(15, 15, 10, 0.1, True, 0)[4] == False
    assert comfort_models.comfAdaptiveComfortASH55(24, 24, 20, 0.1, True, 0)[4] == True


def test_comfPierceSET():
    """ Test the SET function using the reference table from the ASHRAE 55 2017"""

    # import reference table
    df_set = pd.read_csv('SET_test.csv')

    # loop over the rows
    for index, row in df_set.iterrows():
        assert np.round(comfort_models.comfPierceSET(row['t'], row['mrt'], row['v'], row['rh'], row['met'], row['clo']), 1) == row['set']

