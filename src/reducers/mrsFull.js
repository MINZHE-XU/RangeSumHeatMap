const origin = [
  {
    id: 0,
    north: -33.03900467904444,
    south: -34.03900467904444,
    west: 150.4849853515625,
    east: 151.4849853515625,
    rs: 1
  }, {
    id: 1,
    north: -33.33900467904444,
    south: -34.33900467904444,
    west: 150.0849853515625,
    east: 151.0849853515625,
    rs: 1
  }
]
const origin1 = [
  {
    id: 0,
    north: 90,
    south: -90,
    west: -180,
    east: 180,
    rs: 0
  }
]
const mrs = (state = origin1, action, spots) => {
  switch (action.type) {
    case 'FULLY_UPDATE_MRS':
      console.log(action)
      console.log(spots)

      const rectangles = pointToRectangle(spots, action.size)
      //console.log(rectangles)
      const sweepedData = sweepRectangle(rectangles)
      const sweepedMRs = sweepedDataToRectangle(sweepedData, 0)
      return sweepedMRs
      break;
    default:
      return state
  }
}

//fully update functions
/**
      console.log(action)
      console.log(action.spots)
      console.log(action.size)
      console.log("rectangles")
      console.log(rectangles)
      console.log("sweepedData")
      console.log(sweepedData)
      console.log("sweepedMRs")
      console.log(sweepedMRs)
      **/
export function sweepedDataToRectangle(sweepedData, limit) {
  let mrs = [];
  let nextTodoId = 0;
  if (sweepedData.length === 0) {
    return mrs
  } else {
    for (let i = 0; i < sweepedData.length; i++) {
      let westValue = sweepedData[i].xValue;
      let eastValue;
      if (i === sweepedData.length - 1) {
        eastValue = sweepedData[0].xValue;
      } else {
        eastValue = sweepedData[i + 1].xValue;
      }

      let yGroup = getYGroup(sweepedData[i].group)
      //console.log(sweepedData[i].group)
      yGroup.map(function(ay) {
        if (ay.rs >= limit) {
          mrs = mrs.concat([
            {
              id: nextTodoId++,
              north: ay.northValue,
              south: ay.southValue,
              east: eastValue,
              west: westValue,
              rs: ay.rs
            }
          ])
          return 1;
        }

      });

    }
    return mrs
  }
}
export function getYGroup(sweepedDataGroup) {
  //sweepedDataGroup.sort(function (x, y) {if (x.y < y.y) {return -1;}if (x.y > y.y) {return 1;}return 0;});
  //xs=Array.from(new Set(xs));
  let yValues = sweepedDataGroup.map(function(sweepedDataGroup1) {
    return sweepedDataGroup1.y;
  });
  //contain all the rectangle y value
  yValues = yValues.concat([-90, 90]);
  yValues.sort(function(x, y) {
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  });
  yValues = Array.from(new Set(yValues));
  //console.log(yValues)
  let tempRS = 0;
  let yGroup = [];
  //become y with rs
  for (let i = 0; i < yValues.length - 1; i++) {
    sweepedDataGroup.map(function(sweepedData) {
      if (sweepedData.y >= yValues[i] && sweepedData.y < yValues[i + 1]) {
        switch (sweepedData.type) {
          case "down":
            tempRS = tempRS + 1;
            break;
          case "up":
            tempRS = tempRS - 1;
            break;
          default:
        }
      }
      return 1;
    });
    yGroup = yGroup.concat([
      {
        southValue: yValues[i],
        northValue: yValues[i + 1],
        rs: tempRS
      }
    ]);
  }
  return yGroup
}

export function sweepRectangle(rectangles) {
  let nextTodoId = 0;
  let sweepedStore = [];
  let xs = rectangles.map(function(rectangle) {
    return [rectangle.west, rectangle.east];
  });
  if (xs.length >= 1) {
    xs = xs.reduce(function(a, b) {
      return a.concat(b);
    });
  }
  //kick duplicated
  xs = Array.from(new Set(xs));
  // xs is each x value while sweep
  //group is each y points owned by each x
  xs.sort(function(x, y) {
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  });
  let groups = xs.map(function(x) {
    let forX = rectangles.map(function(rectangle) {
      if (rectangle.west < rectangle.east) {
        //common case
        if (x >= rectangle.west && x < rectangle.east) {
          return [
            {
              y: rectangle.south,
              type: "down"
            }, {
              y: rectangle.north,
              type: "up"
            }
          ];
        } else {
          return [];
        }

      } else {
        //other case
        if (x >= rectangle.west || x < rectangle.east) {
          return [
            {
              y: rectangle.south,
              type: "down"
            }, {
              y: rectangle.north,
              type: "up"
            }
          ];
        } else {
          return [];
        }
      }

    });
    if (forX.length >= 1) {
      forX = forX.reduce(function(a, b) {
        return a.concat(b);
      });
    }
    return {xValue: x, group: forX};
  })
  //console.log("xs")
  //console.log(xs)

  return groups
}

export function pointToRectangle(spots, size) {
  let nextTodoId = 0
  const rectangles = spots.map(function(spot) {
    let northValue = spot.lat + size.height / 2
    if (northValue > 90) {
      northValue = 90
    }
    let southValue = spot.lat - size.height / 2
    if (southValue < -90) {
      southValue = -90
    }
    let westValue = spot.lng - size.length / 2
    if (westValue <= -180) {
      westValue = westValue + 360
    }
    let eastValue = spot.lng + size.length / 2
    if (eastValue > 180) {
      eastValue = eastValue - 360
    }
    return {
      id: nextTodoId++,
      north: northValue,
      south: southValue,
      east: eastValue,
      west: westValue,
      rs: 1
    };
  });
  return rectangles
}

export default mrs
