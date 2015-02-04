var mrt = {};

mrt.find_span = function(arr, x){
    // for ordered array arr and value x, find the left index
    // of the closed interval that the value falls in.
    for (var i = 0; i < arr.length - 1; i++){
        if (x <= arr[i+1] && x >= arr[i]){
            return i;
        }
    }
    return -1;
}

mrt.get_fp = function(alt, az, posture){
    //  alt : altitude of sun in degrees [0, 90] Integer
    //  az : azimuth of sun in degrees [0, 180] Integer
    var fp;
    var alt_range = [0, 15, 30, 45, 60, 75, 90];
    var az_range = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];
    
    var alt_i = mrt.find_span(alt_range, alt);
    var az_i = mrt.find_span(az_range, az);
   

    if (posture == 'standing'){
        var fp_table = [
        /*azm=0*/   [0.348, 0.348,  0.315,  0.257,  0.204,  0.143,  0.082],
        /*azm=15*/  [0.343, 0.343,  0.312,  0.254,  0.200,  0.140,  0.082],
        /*azm=30*/  [0.332, 0.332,  0.300,  0.242,  0.190,  0.134,  0.082],
        /*azm=45*/  [0.313, 0.313,  0.278,  0.227,  0.176,  0.123,  0.082],
        /*azm=60*/  [0.283, 0.283,  0.250,  0.207,  0.161,  0.113,  0.082],
        /*azm=75*/  [0.253, 0.253,  0.228,  0.188,  0.150,  0.107,  0.082],
        /*azm=90*/  [0.230, 0.230,  0.213,  0.180,  0.148,  0.108,  0.082],
        /*azm=105*/ [0.242, 0.242,  0.222,  0.188,  0.154,  0.111,  0.082],
        /*azm=120*/ [0.274, 0.274,  0.245,  0.204,  0.164,  0.115,  0.082],
        /*azm=135*/ [0.303, 0.303,  0.270,  0.220,  0.174,  0.121,  0.082],
        /*azm=150*/ [0.328, 0.328,  0.291,  0.234,  0.183,  0.124,  0.082],
        /*azm=165*/ [0.343, 0.343,  0.303,  0.243,  0.189,  0.127,  0.082],
        /*azm=180*/ [0.345, 0.345,  0.308,  0.245,  0.191,  0.127,  0.082]
        ];
    } else if (posture == 'seated'){
        var fp_table = [
        /*azm=0*/   [0.290, 0.325,  0.305,  0.305,  0.262,  0.223,  0.178],
        /*azm=15*/  [0.293, 0.328,  0.294,  0.288,  0.268,  0.225,  0.178],
        /*azm=30*/  [0.288, 0.333,  0.298,  0.290,  0.262,  0.222,  0.178],
        /*azm=45*/  [0.275, 0.325,  0.295,  0.288,  0.252,  0.213,  0.178],
        /*azm=60*/  [0.255, 0.308,  0.281,  0.277,  0.241,  0.202,  0.178],
        /*azm=75*/  [0.228, 0.282,  0.261,  0.261,  0.231,  0.193,  0.178],
        /*azm=90*/  [0.215, 0.260,  0.242,  0.248,  0.220,  0.186,  0.178],
        /*azm=105*/ [0.235, 0.258,  0.228,  0.237,  0.209,  0.180,  0.178],
        /*azm=120*/ [0.263, 0.259,  0.208,  0.223,  0.196,  0.175,  0.178],
        /*azm=135*/ [0.280, 0.260,  0.192,  0.210,  0.185,  0.170,  0.178],
        /*azm=150*/ [0.300, 0.258,  0.175,  0.195,  0.169,  0.168,  0.178],
        /*azm=165*/ [0.305, 0.250,  0.158,  0.180,  0.155,  0.164,  0.178],
        /*azm=180*/ [0.300, 0.240,  0.152,  0.169,  0.154,  0.165,  0.178]
        ];
    }
    
    var fp11 = fp_table[az_i][alt_i];
    var fp12 = fp_table[az_i][alt_i+1];
    var fp21 = fp_table[az_i+1][alt_i];
    var fp22 = fp_table[az_i+1][alt_i+1];

    var az1 = az_range[az_i];
    var az2 = az_range[az_i+1];
    var alt1 = alt_range[alt_i];
    var alt2 = alt_range[alt_i+1];
    
    // bilinear interpolation
    fp = fp11 * (az2 - az) * (alt2 - alt);
    fp += fp21 * (az - az1) * (alt2 - alt);
    fp += fp12 * (az2 - az) * (alt - alt1);
    fp += fp22 * (az - az1) * (alt - alt1);
    fp /= (az2 - az1) * (alt2 - alt1);

    return fp;
}

mrt.fanger_view_factor = function(surface_pos, d_perp, area, person_pos, person_az, posture){
  
    var RAD_TO_DEG = 57.2957795;

    var dx = person_pos.x - surface_pos.x;
    var dy = surface_pos.y - person_pos.y;
    var dz = surface_pos.z - person_pos.z;

    var dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
    var xydist = Math.sqrt(dx*dx + dy*dy);

    var az = Math.atan(dx / dy);
    var alt = Math.atan(dz / xydist);
 
    az = az - person_az;
   
    if (az < 0) {
        az += 2 * Math.PI;
    }

    if (az > Math.PI && alt >= 0) {
        az = 2 * Math.PI - az;
    } else if (az <= Math.PI && alt < 0) {
        alt = -alt;
        az = Math.PI - az;
    } else if (az > Math.PI && alt < 0) {
        alt = -alt;
        az = az - Math.PI;
    }

    az *= RAD_TO_DEG;
    alt *= RAD_TO_DEG;

    var projected_area_factor = mrt.get_fp(alt, az, posture);
    var view_factor = projected_area_factor / Math.PI * d_perp / Math.pow(dist, 3) * area;
    return view_factor;

};

mrt.create_mesh = function(width, height, offset, plane, Nu, Nv){
    var mesh = [];
    var plane0 = plane[0];
    var plane1 = plane[1];
    var perpendicular_plane = 'xyz'.replace(plane0, '').replace(plane1, '');
    for (var i = 0; i < Nu; i++){
        for (var j = 0; j < Nv; j++){
            var p = {};
            p[plane0] = (i + 0.5) * (width / Nu) + offset[plane0];     
            p[plane1] = (j + 0.5) * (height / Nv) + offset[plane1];
            p[perpendicular_plane] = offset[perpendicular_plane];
            mesh.push(p);
        }
    }
    return {'mesh': mesh, 'perpendicular_plane': perpendicular_plane};
};

mrt.mesh_view_factor = function(mesh, d_perp, area, person_pos, person_az, posture, average_azimuths){
    var view_factor = 0;
    var az_L = 4;
    var daz = 0.5 * Math.PI;

    for (var i = 0; i < mesh.length; i++){
        var p = mesh[i]; 
        if (average_azimuths){
            sum_view_factor = 0;
            for (var iaz = 0; iaz < az_L; iaz++){
                sum_view_factor += mrt.fanger_view_factor(p, d_perp, area, person_pos, iaz * daz, posture);
            } 
            view_factor += sum_view_factor / az_L;
        } else {
            var dvf = mrt.fanger_view_factor(p, d_perp, area, person_pos, person_az, posture);
            view_factor += dvf;
        }
    } 
    return view_factor;
};

mrt.room = {
    'width': 10, 
    'length': 5, 
    'height': 2.6
};

mrt.walls = [
    {
        'name': 'wall1', 
        'temperature': 21.0, 
        'emissivity': 0.9, 
        'plane': 'xz', 
        'u': mrt.room.width,
        'v': mrt.room.height,
        'offset': {'x': 0, 'y': 0, 'z': 0},
        'subsurfaces': [
            {
                'name': 'panel1',
                'temperature': 30,
                'emissivity': 0.9,
                'u': 2, 
                'v': 2,
                'width': 2,
                'height': 2,
            },
            {
                'name': 'panel2',
                'temperature': 50,
                'emissivity': 0.9,
                'u': 0, 
                'v': 0,
                'width': 2,
                'height': 2,
            },
        ],
    },
    {
        'name': 'wall2', 
        'temperature': 21.0, 
        'emissivity': 0.9, 
        'plane': 'yz', 
        'u': mrt.room.length,
        'v': mrt.room.height,
        'offset': {'x': mrt.room.width, 'y': 0, 'z': 0}
    },
    {
        'name': 'wall3', 
        'temperature': 21.0, 
        'emissivity': 0.9, 
        'plane': 'xz', 
        'u': mrt.room.width,
        'v': mrt.room.height,
        'offset': {'x': 0, 'y': mrt.room.length, 'z': 0}
    },
    {
        'name': 'wall4', 
        'temperature': 21.0, 
        'emissivity': 0.9, 
        'plane': 'yz', 
        'u': mrt.room.length,
        'v': mrt.room.height,
        'offset': {'x': 0, 'y': 0, 'z': 0}
    },
    {
        'name': 'ceiling', 
        'temperature': 21.0, 
        'emissivity': 0.9, 
        'plane': 'xy', 
        'u': mrt.room.width,
        'v': mrt.room.length,
        'offset': {'x': 0, 'y': 0, 'z': mrt.room.height}
    },
    {
        'name': 'floor', 
        'temperature': 21.0, 
        'emissivity': 0.9, 
        'plane': 'xy', 
        'u': mrt.room.width,
        'v': mrt.room.length,
        'offset': {'x': 0, 'y': 0, 'z': 0}
    }
];

mrt.occupant = {
    'position': {'x': 1, 'y': 1},
    'azimuth': Math.PI / 3, 
    'posture': 'seated'
};

mrt.calc = function(){

    var Nu = 50;
    var Nv = 50;
    var my_mrt = 0;
    var vf_total = 0;
    var vf_emis_total = 0;
    var average_azimuths = false;

    mrt.occupant.position.z = (mrt.occupant.posture == 'seated') ? 0.6 : 1.0

    for (var i = 0; i < mrt.walls.length; i++){
        var surface = mrt.walls[i];
        var mesh = mrt.create_mesh(surface.u, surface.v, surface.offset, surface.plane, Nu, Nv);
        var mesh_area = surface.u / Nu * surface.v / Nv;
        var d_perp = Math.abs(mrt.occupant.position[mesh.perpendicular_plane] 
                - surface.offset[mesh.perpendicular_plane]);
        var vf = mrt.mesh_view_factor(mesh.mesh, 
                d_perp, mesh_area, mrt.occupant.position, 
                mrt.occupant.azimuth, mrt.occupant.posture, average_azimuths)

        if (surface.hasOwnProperty('subsurfaces')){
            for (var j = 0; j < surface.subsurfaces.length; j++){
                var subsurface = surface.subsurfaces[j];
                // start with offset of parent surface
                var offset = {'x': surface.offset.x, 'y': surface.offset.y, 'z': surface.offset.z};
                // offset according to the lower left vertex
                offset[surface.plane[0]] += subsurface.u;
                offset[surface.plane[1]] += subsurface.v;
                var subsurface_mesh = mrt.create_mesh(subsurface.width, subsurface.height, 
                    offset, surface.plane, Nu, Nv);
                var subsurface_mesh_area = subsurface.width / Nu * subsurface.height / Nv;
                var sub_vf = mrt.mesh_view_factor(subsurface_mesh.mesh, d_perp, subsurface_mesh_area,
                    mrt.occupant.position, mrt.occupant.azimuth, mrt.occupant.posture, average_azimuths);
                vf -= sub_vf;
                vf_total += sub_vf;
                vf_emis_total += subsurface.emissivity * sub_vf;
                my_mrt += sub_vf * subsurface.emissivity * Math.pow(subsurface.temperature + 273.15, 4);
                console.log(subsurface.name + ": ", sub_vf);
            }

        }
        console.log(surface.name + ": ", vf);
        vf_total += vf;
        vf_emis_total += surface.emissivity * vf;
        my_mrt += vf * surface.emissivity * Math.pow(surface.temperature + 273.15, 4);
    }

    my_mrt /= vf_emis_total;
    my_mrt = Math.pow(my_mrt, 0.25);
    my_mrt -= 273.15;

    console.log(vf_total);
    console.log(vf_emis_total);
    console.log(my_mrt);
}

mrt.test = function(){
    var w = 10;
    var h = 10;
    var offset = {'x': 0, 'y': 0, 'z': 1};
    var Nu = 50;
    var Nv = 50;
    var mesh_area = w / Nu * h / Nv;
    var mesh = mrt.create_mesh(w, h, offset, 'xy', Nu, Nv);

    var person_pos = {'x': 5, 'y': 5, 'z': 5};
    // d_perp: perpendicular distance to plane
    var d_perp = person_pos[mesh.perpendicular_plane] - offset[mesh.perpendicular_plane] 
    var person_az = Math.PI / 2;
    var posture = 'seated';
    var average_azimuths = false;
    var vf = mrt.mesh_view_factor(mesh.mesh, d_perp, mesh_area, person_pos, person_az, posture, average_azimuths);
    console.log(vf)
}
