"use strict";
var Control_Applicative = require("../Control.Applicative/index.js");
var Control_Bind = require("../Control.Bind/index.js");
var Control_Category = require("../Control.Category/index.js");
var Data_Array = require("../Data.Array/index.js");
var Data_Eq = require("../Data.Eq/index.js");
var Data_EuclideanRing = require("../Data.EuclideanRing/index.js");
var Data_Function = require("../Data.Function/index.js");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra/index.js");
var Data_Identity = require("../Data.Identity/index.js");
var Data_Maybe = require("../Data.Maybe/index.js");
var Data_Ring = require("../Data.Ring/index.js");
var Data_Semiring = require("../Data.Semiring/index.js");
var Data_Tuple = require("../Data.Tuple/index.js");
var Prelude = require("../Prelude/index.js");
var Quantities_Models = require("../Quantities.Models/index.js");
var oddPair = function (i) {
    return function (arr) {
        return function (backup) {
            var n = Data_Array.length(arr);
            var index = function (at) {
                return Data_Maybe.maybe(backup)(Control_Category.identity(Control_Category.categoryFn))(Data_Array.index(arr)(at));
            };
            return [ index(n - i | 0), index(i - 1 | 0) ];
        };
    };
};
var shuffle = function ($copy_v) {
    return function ($copy_deck) {
        var $tco_var_v = $copy_v;
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(v, deck) {
            if (v === 0) {
                $tco_done = true;
                return deck;
            };
            var subdecks = Control_Bind.bind(Control_Bind.bindArray)(Data_Array.range(1)(Data_EuclideanRing.div(Data_EuclideanRing.euclideanRingInt)(Data_Array.length(deck))(2)))(function (v1) {
                return Control_Applicative.pure(Control_Applicative.applicativeArray)(oddPair(v1)(deck)(new Quantities_Models.Center({
                    center_x: 100,
                    center_y: 100
                })));
            });
            $tco_var_v = v - 1 | 0;
            $copy_deck = Data_Array.concat(subdecks);
            return;
        };
        while (!$tco_done) {
            $tco_result = $tco_loop($tco_var_v, $copy_deck);
        };
        return $tco_result;
    };
};
var fits = function (size) {
    return function (padding) {
        return function (v) {
            var space = 2 * (size + padding | 0) | 0;
            return Data_EuclideanRing.mod(Data_EuclideanRing.euclideanRingInt)(v.value0.center_y)(space) === 0 && Data_EuclideanRing.mod(Data_EuclideanRing.euclideanRingInt)(v.value0.center_x)(space) === 0;
        };
    };
};
var quantities = function (v) {
    return function (domain) {
        var quantity = Data_EuclideanRing.mod(Data_EuclideanRing.euclideanRingInt)(v.randomness)(v.limit);
        return Data_Array.take(quantity)(shuffle(v.randomness)(Data_Array.filter(fits(v.size)(v.padding))(domain)));
    };
};
module.exports = {
    quantities: quantities
};