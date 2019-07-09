import unittest
import comfort_models
import csv


class TestComfortFunctions(unittest.TestCase):

    def test_comfAdaptiveComfortASH55(self):
        """ Test the SET function using the reference table from the ASHRAE 55 2017"""

        self.assertFalse(comfort_models.comfAdaptiveComfortASH55(15, 15, 10, 0.1, True, 0)[4])
        self.assertTrue(comfort_models.comfAdaptiveComfortASH55(24, 24, 20, 0.1, True, 0)[4])

    def test_comfPierceSET(self):
        """ Test the SET function using the reference table from the ASHRAE 55 2017"""

        # import reference table
        with open('SET_test.csv') as csv_file:
            csv_reader = csv.DictReader(csv_file)
            for row in csv_reader:
                # convert elements to float
                for el in row.keys():
                    row[el] = float(row[el])
                # assert that the SET calculated value matches the value from the ASHRAE standard
                self.assertEqual(round(comfort_models.comfPierceSET(row['t'], row['mrt'], row['v'], row['rh'], row['met'], row['clo']), 1), row['set'])
