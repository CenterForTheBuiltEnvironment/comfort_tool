# PMV Model

Six primary factors affect thermal comfort. These include environmental conditions such as air temperature, and personal factors such as metabolic rate.

## Environmental factors

### Dry-bulb air Temperature

By modifying this value, you will notice the output in the upper-right region changing, as well as the red dot on the chart moving. Depending on which specification of humidity is being used, the red dot may follow the lines of constant relative humidity, or move horizontally. This value does not affect the comfort zone itself, since the zone represents a range of air temperature and humidity values. Next to the air temperature box, you can click on the 'use operative temperature' button. When this option is selected, it will be assumed that the air temperature and mean radiant temperature are equal to the value in the operative temperature input field.

### Mean Radiant Temperature \(MRT\)

MRT represents the mean of the radiant temperatures of the enclosing surfaces of a space, which is determined by the emissivity and the temperature of the surfaces. This value affects the location of the comfort zone, since it may affect the range of acceptable air temperatures. For example, higher radiant temperatures allow the occupant to feel comfortable at lower air temperatures, or vice versa. Thus, an increase in MRT shifts the comfort zone to the left side of the charts.

### Air Speed

This is the rate of spatial change of air in a space, which is used to calculate convective heat transfer and thus changes the comfort zone. Higher air speeds allow higher temperatures and humidity, due to the cooling effect that air movement has on an occupant. Local air speed control is the ability for the occupants to modify the local air flow, and if this is not available in their space, limits apply to the range of temperatures that can be covered. Therefore, availability of local control allows wider ranges of air speed that can be used to offset higher temperatures.

#### Self-generated Air Speed

The body movement affects the air speed surrounding the human body. Consequently, the sum of the average air speed and the self-generated air speed shall be used as input in the PMV model. In accordance with the ASHRAE 55 and the ISO 7730, if the metabolic rate is higher than 1 met, the self-generated air speed is calculated using the following equation: V\_sg = V + 0.3 \(MET - 1\). Where V is the "Average air speed" and MET is the "Metabolic rate". The CBE comfort tool automatically calculates the self-generated air speed for you in the background and sums it to the average air speed you entered in the tool.

### Relative Humidity

Relative Humidity is the ratio of the partial pressure of the water vapor in the air to the saturation pressure of water vapor at the same temperature. You can also input dew-point temperature, humidity ratio, wet bulb temperature, or vapor pressure, by selecting it through the expandable box. Humidity will change the position of the dot. It doesn't affect the comfort zone boundary since the boundary represents a range of temperature and humidity, but it does affect the PMV/PPD calculations.

## Personal factors

### Metabolic Rate

Metabolic rate is the rate of energy production of the body, which varies for different activities. A list of common activities and correspondent metabolic rate in met units is available next to the input box. You can either chose one value from the list or type a different and more precise one directly, as preferred. Increasing the metabolic activity means moving the comfort zone significantly towards lower temperatures and vice versa, since higher activities make the body produce more heat and thus be more comfortable in colder environments. Elevated metabolic rate can also result in decreased effective clothing value and increased relative air speed \(as air is pumped through clothing\).

### Clothing level

Clothing is probably the most important variable in terms of adaptation to a thermal environment, and this means that acting on the clothing level may be very effective to reduce energy consumption. This tool allows you to select clo values for common clothing ensembles by the list on the right of the input box, or also to create a custom ensemble by choosing every garment that composes it, by clicking on the button just beneath. This meets the methods provided by the Standard to evaluate the clothing insulation, as you can see in more depth by clicking on the Wikipedia link. It's important not to forget the clo value provided by the chair, that can be found in the list of garments. Once the ensemble has been created, the clo value can be set to the input field.

#### Dynamic clothing insulation

The body movement affects the insulation characteristics of the clothing and the adjacent air layer. Consequently, the dynamic clothing insulation \(I\_clo\_dynamic\) shall be used as input to calculate the thermal comfort indices.

* ASHRAE 55 Standard: defines that the following equation shall be used to calculate the dynamic clothing insulation. I\_clo\_dynamic = CLO \(0.6 + 0.4 / MET\). Where CLO is the "Clothing level" and MET is the "Metabolic rate" you entered as input in the CBE thermal comfort tool, respectively. The CBE comfort tool automatically calculates the dynamic clothing insulation for you in the background.

