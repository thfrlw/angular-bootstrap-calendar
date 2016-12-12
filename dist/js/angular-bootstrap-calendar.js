/**
 * angular-bootstrap-calendar - A pure AngularJS bootstrap themed responsive calendar that can display events and has views for year, month, week and day
 * @version v0.27.1
 * @link https://github.com/mattlewis92/angular-bootstrap-calendar
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"), require("moment"));
	else if(typeof define === 'function' && define.amd)
		define(["angular", "moment"], factory);
	else if(typeof exports === 'object')
		exports["angularBootstrapCalendarModuleName"] = factory(require("angular"), require("moment"));
	else
		root["angularBootstrapCalendarModuleName"] = factory(root["angular"], root["moment"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_12__, __WEBPACK_EXTERNAL_MODULE_53__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(8);

	var angular = __webpack_require__(12);

	function requireAll(r) {
	  r.keys().forEach(r);
	}

	var templates = {};

	if (false) {

	  var templatesContext = require.context('./templates', false, /\.html/);

	  templatesContext.keys().forEach(function(templateName) {
	    var templateNameWithoutPrefix = templateName.replace('./', '');
	    var cacheTemplateName = 'mwl/' + templateNameWithoutPrefix;
	    var configTemplateName = templateNameWithoutPrefix.replace('.html', '');
	    templates[configTemplateName] = {
	      cacheTemplateName: cacheTemplateName,
	      template: templatesContext(templateName)
	    };
	  });

	}

	module.exports = angular
	  .module('mwl.calendar', [])
	  .config(["calendarConfig", function(calendarConfig) {
	    angular.forEach(templates, function(template, templateName) {
	      if (!calendarConfig.templates[templateName]) {
	        calendarConfig.templates[templateName] = template.cacheTemplateName;
	      }
	    });
	  }])
	  .run(["$templateCache", "$interpolate", function($templateCache, $interpolate) {

	    angular.forEach(templates, function(template) {
	      if (!$templateCache.get(template.cacheTemplateName)) {
	        var templateContents = template.template
	          .replace('{{', $interpolate.startSymbol())
	          .replace('}}', $interpolate.endSymbol());
	        $templateCache.put(template.cacheTemplateName, templateContents);
	      }
	    });

	  }]).name;

	requireAll(__webpack_require__(13));
	requireAll(__webpack_require__(17));
	requireAll(__webpack_require__(22));


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_12__;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./mwlCalendar.js": 14,
		"./mwlCalendarMonth.js": 15,
		"./mwlDateModifier.js": 16
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 13;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);
	var LOG_PREFIX = 'Bootstrap calendar:';

	angular
	  .module('mwl.calendar')
	  .controller('MwlCalendarCtrl', ["$scope", "$log", "$timeout", "$attrs", "$locale", "moment", "calendarTitle", "calendarHelper", function($scope, $log, $timeout, $attrs, $locale, moment, calendarTitle, calendarHelper) {

	    var vm = this;

	    if (vm.slideBoxDisabled) {
	      $log.warn(LOG_PREFIX, 'The `slide-box-disabled` option is deprecated and will be removed in the next release. ' +
	        'Instead set `cell-auto-open-disabled` to true');
	    }

	    vm.events = vm.events || [];

	    vm.changeView = function(view, newDay) {
	      vm.view = view;
	      vm.viewDate = newDay;
	    };

	    vm.dateClicked = function(date) {

	      var rawDate = moment(date).toDate();

	      var nextView = {
	        year: 'month',
	        month: 'day',
	        week: 'day'
	      };

	      if (vm.onViewChangeClick({calendarDate: rawDate, calendarNextView: nextView[vm.view]}) !== false) {
	        vm.changeView(nextView[vm.view], rawDate);
	      }

	    };

	    var previousDate = moment(vm.viewDate);
	    var previousView = vm.view;

	    function checkEventIsValid(event) {
	      if (!event.startsAt) {
	        $log.warn(LOG_PREFIX, 'Event is missing the startsAt field', event);
	      } else if (!angular.isDate(event.startsAt)) {
	        $log.warn(LOG_PREFIX, 'Event startsAt should be a javascript date object. Do `new Date(event.startsAt)` to fix it.', event);
	      }

	      if (event.endsAt) {
	        if (!angular.isDate(event.endsAt)) {
	          $log.warn(LOG_PREFIX, 'Event endsAt should be a javascript date object. Do `new Date(event.endsAt)` to fix it.', event);
	        }
	        if (moment(event.startsAt).isAfter(moment(event.endsAt))) {
	          $log.warn(LOG_PREFIX, 'Event cannot start after it finishes', event);
	        }
	      }
	    }

	    function refreshCalendar() {

	      if (calendarTitle[vm.view] && angular.isDefined($attrs.viewTitle)) {
	        vm.viewTitle = calendarTitle[vm.view](vm.viewDate);
	      }

	      vm.events.forEach(function(event, index) {
	        checkEventIsValid(event);
	        event.calendarEventId = index;
	      });

	      //if on-timespan-click="calendarDay = calendarDate" is set then don't update the view as nothing needs to change
	      var currentDate = moment(vm.viewDate);
	      var shouldUpdate = true;
	      if (
	        previousDate.clone().startOf(vm.view).isSame(currentDate.clone().startOf(vm.view)) &&
	        !previousDate.isSame(currentDate) &&
	        vm.view === previousView
	      ) {
	        shouldUpdate = false;
	      }
	      previousDate = currentDate;
	      previousView = vm.view;

	      if (shouldUpdate) {
	        // a $timeout is required as $broadcast is synchronous so if a new events array is set the calendar won't update
	        $timeout(function() {
	          $scope.$broadcast('calendar.refreshView');
	        });
	      }
	    }

	    calendarHelper.loadTemplates().then(function() {
	      vm.templatesLoaded = true;

	      var eventsWatched = false;

	      //Refresh the calendar when any of these variables change.
	      $scope.$watchGroup([
	        'vm.viewDate',
	        'vm.view',
	        'vm.cellIsOpen',
	        function() {
	          return moment.locale() + $locale.id; //Auto update the calendar when the locale changes
	        }
	      ], function() {
	        if (!eventsWatched) {
	          eventsWatched = true;
	          //need to deep watch events hence why it isn't included in the watch group
	          $scope.$watch('vm.events', refreshCalendar, true); //this will call refreshCalendar when the watcher starts (i.e. now)
	        } else {
	          refreshCalendar();
	        }
	      });

	    }).catch(function(err) {
	      $log.error('Could not load all calendar templates', err);
	    });

	  }])
	  .directive('mwlCalendar', function() {

	    return {
	      // template: '<div mwl-dynamic-directive-template name="calendar" overrides="vm.customTemplateUrls"></div>',
	      templateUrl: 'mwl/calendar.html',
	      restrict: 'E',
	      scope: {
	        events: '=',
	        view: '=',
	        viewTitle: '=?',
	        viewDate: '=',
	        cellIsOpen: '=?',
	        cellAutoOpenDisabled: '=?',
	        slideBoxDisabled: '=?',
	        customTemplateUrls: '=?',
	        onEventClick: '&',
	        onEventTimesChanged: '&',
	        onTimespanClick: '&',
	        onDateRangeSelect: '&?',
	        onViewChangeClick: '&',
	        cellModifier: '&',
	        dayViewStart: '@',
	        dayViewEnd: '@',
	        dayViewSplit: '@',
	        dayViewEventChunkSize: '@',
	        dayViewEventWidth: '@',
	        templateScope: '=?'
	      },
	      controller: 'MwlCalendarCtrl as vm',
	      bindToController: true
	    };

	  });


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .controller('MwlCalendarMonthCtrl', ["$scope", "moment", "calendarHelper", "calendarConfig", function($scope, moment, calendarHelper, calendarConfig) {

	    var vm = this;
	    vm.calendarConfig = calendarConfig;
	    // vm.calendarEventTitle = calendarEventTitle;
	    vm.openRowIndex = null;

	    function toggleCell() {
	      vm.openRowIndex = null;
	      vm.openDayIndex = null;

	      if (vm.cellIsOpen && vm.view) {
	        vm.view.forEach(function(day, dayIndex) {
	          if (moment(vm.viewDate).startOf('day').isSame(day.date)) {
	            vm.openDayIndex = dayIndex;
	            vm.openRowIndex = Math.floor(dayIndex / 7);
	          }
	        });
	      }
	    }

	    $scope.$on('calendar.refreshView', function() {

	      vm.weekDays = calendarHelper.getWeekDayNames();

	      var monthView = calendarHelper.getMonthView(vm.events, vm.viewDate, vm.cellModifier);
	      vm.view = monthView.days;
	      vm.monthOffsets = monthView.rowOffsets;

	      if (vm.cellAutoOpenDisabled) {
	        toggleCell();
	      } else if (!vm.cellAutoOpenDisabled && vm.cellIsOpen && vm.openRowIndex === null) {
	        //Auto open the calendar to the current day if set
	        vm.openDayIndex = null;
	        vm.view.forEach(function(day) {
	          if (day.inMonth && moment(vm.viewDate).startOf('day').isSame(day.date)) {
	            vm.dayClicked(day, true);
	          }
	        });
	      }

	    });

	    if (vm.cellAutoOpenDisabled) {
	      $scope.$watchGroup([
	        'vm.cellIsOpen',
	        'vm.viewDate'
	      ], toggleCell);
	    }

	    vm.dayClicked = function(day, dayClickedFirstRun, $event) {

	      if (!dayClickedFirstRun) {
	        vm.onTimespanClick({
	          calendarDate: day.date.toDate(),
	          calendarCell: day,
	          $event: $event
	        });
	        if ($event && $event.defaultPrevented) {
	          return;
	        }
	      }

	      if (!vm.cellAutoOpenDisabled) {
	        vm.openRowIndex = null;
	        var dayIndex = vm.view.indexOf(day);
	        if (dayIndex === vm.openDayIndex) { //the day has been clicked and is already open
	          vm.openDayIndex = null; //close the open day
	          vm.cellIsOpen = false;
	        } else {
	          vm.openDayIndex = dayIndex;
	          vm.openRowIndex = Math.floor(dayIndex / 7);
	          vm.cellIsOpen = true;
	        }
	      }

	    };

	    // vm.highlightEvent = function(event, shouldAddClass) {
	    //
	    //   vm.view.forEach(function(day) {
	    //     delete day.highlightClass;
	    //     delete day.backgroundColor;
	    //     if (shouldAddClass) {
	    //       var dayContainsEvent = day.events.indexOf(event) > -1;
	    //       if (dayContainsEvent) {
	    //         day.backgroundColor = event.color ? event.color.secondary : '';
	    //       }
	    //     }
	    //   });
	    //
	    // };

	    // vm.handleEventDrop = function(event, newDayDate, draggedFromDate) {
	    //
	    //   var newStart = moment(event.startsAt)
	    //     .date(moment(newDayDate).date())
	    //     .month(moment(newDayDate).month())
	    //     .year(moment(newDayDate).year());
	    //
	    //   var newEnd = calendarHelper.adjustEndDateFromStartDiff(event.startsAt, newStart, event.endsAt);
	    //
	    //   vm.onEventTimesChanged({
	    //     calendarEvent: event,
	    //     calendarDate: newDayDate,
	    //     calendarNewEventStart: newStart.toDate(),
	    //     calendarNewEventEnd: newEnd ? newEnd.toDate() : null,
	    //     calendarDraggedFromDate: draggedFromDate
	    //   });
	    // };
	    //
	    // vm.getWeekNumberLabel = function(day) {
	    //   var weekNumber = day.date.clone().add(1, 'day').isoWeek();
	    //   if (typeof calendarConfig.i18nStrings.weekNumber === 'function') {
	    //     return calendarConfig.i18nStrings.weekNumber({weekNumber: weekNumber});
	    //   } else {
	    //     return calendarConfig.i18nStrings.weekNumber.replace('{week}', weekNumber);
	    //   }
	    // };
	    //
	    // vm.onDragSelectStart = function(day) {
	    //   if (!vm.dateRangeSelect) {
	    //     vm.dateRangeSelect = {
	    //       startDate: day.date,
	    //       endDate: day.date
	    //     };
	    //   }
	    // };
	    //
	    // vm.onDragSelectMove = function(day) {
	    //   if (vm.dateRangeSelect) {
	    //     vm.dateRangeSelect.endDate = day.date;
	    //   }
	    // };
	    //
	    // vm.onDragSelectEnd = function(day) {
	    //   vm.dateRangeSelect.endDate = day.date;
	    //   if (vm.dateRangeSelect.endDate > vm.dateRangeSelect.startDate) {
	    //     vm.onDateRangeSelect({
	    //       calendarRangeStartDate: vm.dateRangeSelect.startDate.clone().startOf('day').toDate(),
	    //       calendarRangeEndDate: vm.dateRangeSelect.endDate.clone().endOf('day').toDate()
	    //     });
	    //   }
	    //   delete vm.dateRangeSelect;
	    // };

	  }])
	  .directive('mwlCalendarMonth', function() {

	    return {
	      // template: '<div mwl-dynamic-directive-template name="calendarMonthViewSimple" overrides="vm.customTemplateUrls"></div>',
	      templateUrl: 'mwl/calendarMonthView.html',
	      restrict: 'E',
	      require: '^mwlCalendar',
	      scope: {
	        events: '=',
	        viewDate: '=',
	        onEventClick: '=',
	        onEventTimesChanged: '=',
	        onDateRangeSelect: '=',
	        cellIsOpen: '=',
	        cellAutoOpenDisabled: '=',
	        onTimespanClick: '=',
	        cellModifier: '=',
	        slideBoxDisabled: '=',
	        customTemplateUrls: '=?',
	        templateScope: '=',
	      },
	      controller: 'MwlCalendarMonthCtrl as vm',
	      link: function(scope, element, attrs, calendarCtrl) {
	        scope.vm.calendarCtrl = calendarCtrl;
	      },
	      bindToController: true
	    };

	  });


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .controller('MwlDateModifierCtrl', ["$element", "$attrs", "$scope", "moment", function($element, $attrs, $scope, moment) {

	    var vm = this;

	    function onClick() {
	      if (angular.isDefined($attrs.setToToday)) {
	        vm.date = new Date();
	      } else if (angular.isDefined($attrs.increment)) {
	        vm.date = moment(vm.date).add(1, vm.increment).toDate();
	      } else if (angular.isDefined($attrs.decrement)) {
	        vm.date = moment(vm.date).subtract(1, vm.decrement).toDate();
	      }
	      $scope.$apply();
	    }

	    $element.bind('click', onClick);

	    $scope.$on('$destroy', function() {
	      $element.unbind('click', onClick);
	    });

	  }])
	  .directive('mwlDateModifier', function() {

	    return {
	      restrict: 'A',
	      controller: 'MwlDateModifierCtrl as vm',
	      scope: {
	        date: '=',
	        increment: '=',
	        decrement: '='
	      },
	      bindToController: true
	    };

	  });


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./calendarDate.js": 18,
		"./calendarLimitTo.js": 19,
		"./calendarTruncateEventTitle.js": 20,
		"./calendarTrustAsHtml.js": 21
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 17;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .filter('calendarDate', ["calendarHelper", "calendarConfig", function(calendarHelper, calendarConfig) {

	    function calendarDate(date, format, getFromConfig) {

	      if (getFromConfig === true) {
	        format = calendarConfig.dateFormats[format];
	      }

	      return calendarHelper.formatDate(date, format);

	    }

	    // This is stateful because the locale can change as well
	    // as calendarConfig.dateFormats which would change the value outside of this filter
	    calendarDate.$stateful = true;

	    return calendarDate;

	  }]);


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .filter('calendarLimitTo', ["limitToFilter", function(limitToFilter) {

	    if (angular.version.minor >= 4) { //1.4+ supports the begin attribute
	      return limitToFilter;
	    }

	    //Copied from the angular source. Only 1.4 has the begin functionality.
	    return function(input, limit, begin) {
	      if (Math.abs(Number(limit)) === Infinity) {
	        limit = Number(limit);
	      } else {
	        limit = parseInt(limit);
	      }
	      if (isNaN(limit)) {
	        return input;
	      }

	      if (angular.isNumber(input)) {
	        input = input.toString();
	      }
	      if (!angular.isArray(input) && !angular.isString(input)) {
	        return input;
	      }

	      begin = (!begin || isNaN(begin)) ? 0 : parseInt(begin);
	      begin = (begin < 0 && begin >= -input.length) ? input.length + begin : begin;

	      if (limit >= 0) {
	        return input.slice(begin, begin + limit);
	      } else if (begin === 0) {
	        return input.slice(limit, input.length);
	      } else {
	        return input.slice(Math.max(0, begin + limit), begin);
	      }
	    };

	  }]);


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .filter('calendarTruncateEventTitle', function() {

	    return function(string, length, boxHeight) {
	      if (!string) {
	        return '';
	      }

	      //Only truncate if if actually needs truncating
	      if (string.length >= length && string.length / 20 > boxHeight / 30) {
	        return string.substr(0, length) + '...';
	      } else {
	        return string;
	      }
	    };

	  });


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .filter('calendarTrustAsHtml', ["$sce", function($sce) {

	    return function(text) {
	      return $sce.trustAsHtml(text);
	    };

	  }]);


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./calendarConfig.js": 23,
		"./calendarHelper.js": 24,
		"./calendarTitle.js": 51,
		"./moment.js": 52
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 22;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .constant('calendarConfig', {
	    allDateFormats: {
	      angular: {
	        date: {
	          hour: 'ha',
	          day: 'd MMM',
	          month: 'MMMM',
	          weekDay: 'EEEE',
	          time: 'HH:mm',
	          datetime: 'MMM d, h:mm a'
	        },
	        title: {
	          day: 'EEEE d MMMM, yyyy',
	          week: 'Week {week} of {year}',
	          month: 'MMMM yyyy',
	          year: 'yyyy'
	        }
	      },
	      moment: {
	        date: {
	          hour: 'ha',
	          day: 'D MMM',
	          month: 'MMMM',
	          weekDay: 'dddd',
	          time: 'HH:mm',
	          datetime: 'MMM D, h:mm a'
	        },
	        title: {
	          day: 'dddd D MMMM, YYYY',
	          week: 'Week {week} of {year}',
	          month: 'MMMM YYYY',
	          year: 'YYYY'
	        }
	      }
	    },
	    get dateFormats() {
	      return this.allDateFormats[this.dateFormatter].date;
	    },
	    get titleFormats() {
	      return this.allDateFormats[this.dateFormatter].title;
	    },
	    dateFormatter: 'angular',
	    showTimesOnWeekView: false,
	    displayAllMonthEvents: false,
	    i18nStrings: {
	      weekNumber: 'Week {week}'
	    },
	    templates: {},
	    colorTypes: {
	      info: {
	        primary: '#1e90ff',
	        secondary: '#d1e8ff'
	      },
	      important: {
	        primary: '#ad2121',
	        secondary: '#fae3e3'
	      },
	      warning: {
	        primary: '#e3bc08',
	        secondary: '#fdf1ba'
	      },
	      inverse: {
	        primary: '#1b1b1b',
	        secondary: '#c1c1c1'
	      },
	      special: {
	        primary: '#800080',
	        secondary: '#ffe6ff'
	      },
	      success: {
	        primary: '#006400',
	        secondary: '#caffca'
	      }
	    }
	  });


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);
	var calendarUtils = __webpack_require__(25);

	angular
	  .module('mwl.calendar')
	  .factory('calendarHelper', ["$q", "$templateRequest", "dateFilter", "moment", "calendarConfig", function($q, $templateRequest, dateFilter, moment, calendarConfig) {

	    function formatDate(date, format) {
	      if (calendarConfig.dateFormatter === 'angular') {
	        return dateFilter(moment(date).toDate(), format);
	      } else if (calendarConfig.dateFormatter === 'moment') {
	        return moment(date).format(format);
	      } else {
	        throw new Error('Unknown date formatter: ' + calendarConfig.dateFormatter);
	      }
	    }

	    function adjustEndDateFromStartDiff(oldStart, newStart, oldEnd) {
	      if (!oldEnd) {
	        return oldEnd;
	      }
	      var diffInSeconds = moment(newStart).diff(moment(oldStart));
	      return moment(oldEnd).add(diffInSeconds);
	    }

	    // function getRecurringEventPeriod(eventPeriod, recursOn, containerPeriodStart) {
	    //
	    //   var eventStart = moment(eventPeriod.start);
	    //   var eventEnd = moment(eventPeriod.end);
	    //   var periodStart = moment(containerPeriodStart);
	    //
	    //   if (recursOn) {
	    //
	    //     switch (recursOn) {
	    //       case 'year':
	    //         eventStart.set({
	    //           year: periodStart.year()
	    //         });
	    //         break;
	    //
	    //       case 'month':
	    //         eventStart.set({
	    //           year: periodStart.year(),
	    //           month: periodStart.month()
	    //         });
	    //         break;
	    //
	    //       default:
	    //         throw new Error('Invalid value (' + recursOn + ') given for recurs on. Can only be year or month.');
	    //     }
	    //
	    //     eventEnd = adjustEndDateFromStartDiff(eventPeriod.start, eventStart, eventEnd);
	    //
	    //   }
	    //
	    //   return {start: eventStart, end: eventEnd};
	    //
	    // }

	    // function eventIsInPeriod(event, periodStart, periodEnd) {
	    //
	    //   periodStart = moment(periodStart);
	    //   periodEnd = moment(periodEnd);
	    //
	    //   var eventPeriod = getRecurringEventPeriod({start: event.startsAt, end: event.endsAt || event.startsAt}, event.recursOn, periodStart);
	    //   var eventStart = eventPeriod.start;
	    //   var eventEnd = eventPeriod.end;
	    //
	    //   return (eventStart.isAfter(periodStart) && eventStart.isBefore(periodEnd)) ||
	    //     (eventEnd.isAfter(periodStart) && eventEnd.isBefore(periodEnd)) ||
	    //     (eventStart.isBefore(periodStart) && eventEnd.isAfter(periodEnd)) ||
	    //     eventStart.isSame(periodStart) ||
	    //     eventEnd.isSame(periodEnd);
	    //
	    // }

	    // function filterEventsInPeriod(events, startPeriod, endPeriod) {
	    //   return events.filter(function(event) {
	    //     return eventIsInPeriod(event, startPeriod, endPeriod);
	    //   });
	    // }

	    // function getEventsInPeriod(calendarDate, period, allEvents) {
	    //   var startPeriod = moment(calendarDate).startOf(period);
	    //   var endPeriod = moment(calendarDate).endOf(period);
	    //   return filterEventsInPeriod(allEvents, startPeriod, endPeriod);
	    // }

	    // function getBadgeTotal(events) {
	    //   return events.filter(function(event) {
	    //     return event.incrementsBadgeTotal !== false;
	    //   }).length;
	    // }

	    function getWeekDayNames() {
	      var weekdays = [];
	      var count = 0;
	      while (count < 7) {
	        weekdays.push(formatDate(moment().weekday(count++), calendarConfig.dateFormats.weekDay));
	      }
	      return weekdays;
	    }

	    // function getYearView(events, viewDate, cellModifier) {
	    //
	    //   var view = [];
	    //   var eventsInPeriod = getEventsInPeriod(viewDate, 'year', events);
	    //   var month = moment(viewDate).startOf('year');
	    //   var count = 0;
	    //   while (count < 12) {
	    //     var startPeriod = month.clone();
	    //     var endPeriod = startPeriod.clone().endOf('month');
	    //     var periodEvents = filterEventsInPeriod(eventsInPeriod, startPeriod, endPeriod);
	    //     var cell = {
	    //       label: formatDate(startPeriod, calendarConfig.dateFormats.month),
	    //       isToday: startPeriod.isSame(moment().startOf('month')),
	    //       events: periodEvents,
	    //       date: startPeriod,
	    //       badgeTotal: getBadgeTotal(periodEvents)
	    //     };
	    //
	    //     cellModifier({calendarCell: cell});
	    //     view.push(cell);
	    //     month.add(1, 'month');
	    //     count++;
	    //   }
	    //
	    //   return view;
	    //
	    // }

	    function getMonthView(events, viewDate, cellModifier) {

	      // hack required to work with the calendar-utils api
	      events.forEach(function(event) {
	        event.start = event.startsAt;
	        event.end = event.endsAt;
	      });

	      var view = calendarUtils.getMonthView({
	        events: events,
	        viewDate: viewDate,
	        weekStartsOn: moment().startOf('week').day()
	      });

	      view.days = view.days.map(function(day) {
	        day.date = moment(day.date);
	        day.label = day.date.date();
	        // day.badgeTotal = getBadgeTotal(day.events);
	        if (!calendarConfig.displayAllMonthEvents && !day.inMonth) {
	          // day.events = [];
	        }
	        cellModifier({calendarCell: day});
	        return day;
	      });

	      // remove hack
	      events.forEach(function(event) {
	        delete event.start;
	        delete event.end;
	      });

	      // console.log(view);
	      return view;

	    }
	    //
	    // function getWeekView(events, viewDate) {
	    //
	    //   var days = calendarUtils.getWeekViewHeader({
	    //     viewDate: viewDate,
	    //     weekStartsOn: moment().startOf('week').day()
	    //   }).map(function(day) {
	    //     day.date = moment(day.date);
	    //     day.weekDayLabel = formatDate(day.date, calendarConfig.dateFormats.weekDay);
	    //     day.dayLabel = formatDate(day.date, calendarConfig.dateFormats.day);
	    //     return day;
	    //   });
	    //
	    //   var startOfWeek = moment(viewDate).startOf('week');
	    //   var endOfWeek = moment(viewDate).endOf('week');
	    //
	    //   var eventRows = calendarUtils.getWeekView({
	    //     viewDate: viewDate,
	    //     weekStartsOn: moment().startOf('week').day(),
	    //     events: filterEventsInPeriod(events, startOfWeek, endOfWeek).map(function(event) {
	    //
	    //       var weekViewStart = moment(startOfWeek).startOf('day');
	    //
	    //       var eventPeriod = getRecurringEventPeriod({
	    //         start: moment(event.startsAt),
	    //         end: moment(event.endsAt || event.startsAt)
	    //       }, event.recursOn, weekViewStart);
	    //
	    //       eventPeriod.originalEvent = event;
	    //
	    //       return eventPeriod;
	    //
	    //     })
	    //   }).map(function(eventRow) {
	    //
	    //     eventRow.row = eventRow.row.map(function(rowEvent) {
	    //       rowEvent.event = rowEvent.event.originalEvent;
	    //       return rowEvent;
	    //     });
	    //
	    //     return eventRow;
	    //
	    //   });
	    //
	    //   return {days: days, eventRows: eventRows};
	    //
	    // }
	    //
	    // function getDayView(events, viewDate, dayViewStart, dayViewEnd, dayViewSplit, dayViewEventWidth) {
	    //
	    //   var dayStart = (dayViewStart || '00:00').split(':');
	    //   var dayEnd = (dayViewEnd || '23:59').split(':');
	    //
	    //   var view = calendarUtils.getDayView({
	    //     events: events.map(function(event) { // hack required to work with event API
	    //       event.start = event.startsAt;
	    //       event.end = event.endsAt;
	    //       return event;
	    //     }),
	    //     viewDate: viewDate,
	    //     hourSegments: 60 / dayViewSplit,
	    //     dayStart: {
	    //       hour: dayStart[0],
	    //       minute: dayStart[1]
	    //     },
	    //     dayEnd: {
	    //       hour: dayEnd[0],
	    //       minute: dayEnd[1]
	    //     },
	    //     eventWidth: dayViewEventWidth ? +dayViewEventWidth : 150,
	    //     segmentHeight: 30
	    //   });
	    //
	    //   // remove hack to work with new event API
	    //   events.forEach(function(event) {
	    //     delete event.start;
	    //     delete event.end;
	    //   });
	    //
	    //   return view;
	    //
	    // }
	    //
	    // function getWeekViewWithTimes(events, viewDate, dayViewStart, dayViewEnd, dayViewSplit) {
	    //   var weekView = getWeekView(events, viewDate);
	    //   var newEvents = [];
	    //   var flattenedEvents = [];
	    //   weekView.eventRows.forEach(function(row) {
	    //     row.row.forEach(function(eventRow) {
	    //       flattenedEvents.push(eventRow.event);
	    //     });
	    //   });
	    //   weekView.days.forEach(function(day) {
	    //     var dayEvents = flattenedEvents.filter(function(event) {
	    //       return moment(event.startsAt).startOf('day').isSame(moment(day.date).startOf('day'));
	    //     });
	    //     var newDayEvents = getDayView(
	    //       dayEvents,
	    //       day.date,
	    //       dayViewStart,
	    //       dayViewEnd,
	    //       dayViewSplit
	    //     ).events;
	    //     newEvents = newEvents.concat(newDayEvents);
	    //   });
	    //   weekView.eventRows = [{
	    //     row: newEvents.map(function(dayEvent) {
	    //       var event = dayEvent.event;
	    //       return {
	    //         event: event,
	    //         top: dayEvent.top,
	    //         offset: calendarUtils.getWeekViewEventOffset(
	    //           {start: event.startsAt, end: event.endsAt},
	    //           moment(viewDate).startOf('week')
	    //         )
	    //       };
	    //     })
	    //   }];
	    //   return weekView;
	    // }
	    //
	    // function getDayViewHeight(dayViewStart, dayViewEnd, dayViewSplit) {
	    //   var dayViewStartM = moment(dayViewStart || '00:00', 'HH:mm');
	    //   var dayViewEndM = moment(dayViewEnd || '23:59', 'HH:mm');
	    //   var hourHeight = (60 / dayViewSplit) * 30;
	    //   return ((dayViewEndM.diff(dayViewStartM, 'minutes') / 60) * hourHeight) + 3;
	    // }

	    function loadTemplates() {

	      var templatePromises = Object.keys(calendarConfig.templates).map(function(key) {
	        var templateUrl = calendarConfig.templates[key];
	        return $templateRequest(templateUrl);
	      });

	      return $q.all(templatePromises);

	    }

	    return {
	      getWeekDayNames: getWeekDayNames,
	      // getYearView: getYearView,
	      getMonthView: getMonthView,
	      // getWeekView: getWeekView,
	      // getDayView: getDayView,
	      // getWeekViewWithTimes: getWeekViewWithTimes,
	      // getDayViewHeight: getDayViewHeight,
	      adjustEndDateFromStartDiff: adjustEndDateFromStartDiff,
	      formatDate: formatDate,
	      loadTemplates: loadTemplates,
	      // eventIsInPeriod: eventIsInPeriod //expose for testing only
	    };

	  }]);


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory(__webpack_require__(26), __webpack_require__(29), __webpack_require__(30), __webpack_require__(31), __webpack_require__(35), __webpack_require__(37), __webpack_require__(38), __webpack_require__(39), __webpack_require__(40), __webpack_require__(41), __webpack_require__(42), __webpack_require__(43), __webpack_require__(44), __webpack_require__(46), __webpack_require__(47), __webpack_require__(33), __webpack_require__(48), __webpack_require__(49), __webpack_require__(50));
		else if(typeof define === 'function' && define.amd)
			define([, , , , , , , , , , , , , , , , , , ], factory);
		else if(typeof exports === 'object')
			exports["calendarUtils"] = factory(require("date-fns/add_days/index"), require("date-fns/add_hours/index"), require("date-fns/add_minutes/index"), require("date-fns/difference_in_days/index"), require("date-fns/difference_in_minutes/index"), require("date-fns/difference_in_seconds/index"), require("date-fns/end_of_day/index"), require("date-fns/end_of_month/index"), require("date-fns/end_of_week/index"), require("date-fns/get_day/index"), require("date-fns/is_same_day/index"), require("date-fns/is_same_month/index"), require("date-fns/is_same_second/index"), require("date-fns/set_hours/index"), require("date-fns/set_minutes/index"), require("date-fns/start_of_day/index"), require("date-fns/start_of_minute/index"), require("date-fns/start_of_month/index"), require("date-fns/start_of_week/index"));
		else
			root["calendarUtils"] = factory(root["dateFns"]["addDays"], root["dateFns"]["addHours"], root["dateFns"]["addMinutes"], root["dateFns"]["differenceInDays"], root["dateFns"]["differenceInMinutes"], root["dateFns"]["differenceInSeconds"], root["dateFns"]["endOfDay"], root["dateFns"]["endOfMonth"], root["dateFns"]["endOfWeek"], root["dateFns"]["getDay"], root["dateFns"]["isSameDay"], root["dateFns"]["isSameMonth"], root["dateFns"]["isSameSecond"], root["dateFns"]["setHours"], root["dateFns"]["setMinutes"], root["dateFns"]["startOfDay"], root["dateFns"]["startOfMinute"], root["dateFns"]["startOfMonth"], root["dateFns"]["startOfWeek"]);
	})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_9__, __WEBPACK_EXTERNAL_MODULE_10__, __WEBPACK_EXTERNAL_MODULE_11__, __WEBPACK_EXTERNAL_MODULE_12__, __WEBPACK_EXTERNAL_MODULE_13__, __WEBPACK_EXTERNAL_MODULE_14__, __WEBPACK_EXTERNAL_MODULE_15__, __WEBPACK_EXTERNAL_MODULE_16__, __WEBPACK_EXTERNAL_MODULE_17__, __WEBPACK_EXTERNAL_MODULE_18__) {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};

	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {

	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;

	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			i: moduleId,
	/******/ 			l: false,
	/******/ 			exports: {}
	/******/ 		};

	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

	/******/ 		// Flag the module as loaded
	/******/ 		module.l = true;

	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}


	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;

	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;

	/******/ 	// identity function for calling harmory imports with the correct context
	/******/ 	__webpack_require__.i = function(value) { return value; };

	/******/ 	// define getter function for harmory exports
	/******/ 	__webpack_require__.d = function(exports, name, getter) {
	/******/ 		Object.defineProperty(exports, name, {
	/******/ 			configurable: false,
	/******/ 			enumerable: true,
	/******/ 			get: getter
	/******/ 		});
	/******/ 	};

	/******/ 	// getDefaultExport function for compatibility with non-harmony modules
	/******/ 	__webpack_require__.n = function(module) {
	/******/ 		var getter = module && module.__esModule ?
	/******/ 			function getDefault() { return module['default']; } :
	/******/ 			function getModuleExports() { return module; };
	/******/ 		__webpack_require__.d(getter, 'a', getter);
	/******/ 		return getter;
	/******/ 	};

	/******/ 	// Object.prototype.hasOwnProperty.call
	/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";

	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(__webpack_require__.s = 19);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

	/***/ },
	/* 1 */
	/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

	/***/ },
	/* 2 */
	/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

	/***/ },
	/* 3 */
	/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

	/***/ },
	/* 4 */
	/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

	/***/ },
	/* 5 */
	/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

	/***/ },
	/* 6 */
	/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

	/***/ },
	/* 7 */
	/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

	/***/ },
	/* 8 */
	/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

	/***/ },
	/* 9 */
	/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_9__;

	/***/ },
	/* 10 */
	/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_10__;

	/***/ },
	/* 11 */
	/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_11__;

	/***/ },
	/* 12 */
	/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_12__;

	/***/ },
	/* 13 */
	/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_13__;

	/***/ },
	/* 14 */
	/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_14__;

	/***/ },
	/* 15 */
	/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_15__;

	/***/ },
	/* 16 */
	/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_16__;

	/***/ },
	/* 17 */
	/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_17__;

	/***/ },
	/* 18 */
	/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_18__;

	/***/ },
	/* 19 */
	/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_date_fns_end_of_day__ = __webpack_require__(6);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_date_fns_end_of_day___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_date_fns_end_of_day__);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_date_fns_add_minutes__ = __webpack_require__(2);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_date_fns_add_minutes___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_date_fns_add_minutes__);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_date_fns_difference_in_days__ = __webpack_require__(3);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_date_fns_difference_in_days___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_date_fns_difference_in_days__);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_date_fns_start_of_day__ = __webpack_require__(15);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_date_fns_start_of_day___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_date_fns_start_of_day__);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_date_fns_is_same_day__ = __webpack_require__(10);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_date_fns_is_same_day___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_date_fns_is_same_day__);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_date_fns_get_day__ = __webpack_require__(9);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_date_fns_get_day___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_date_fns_get_day__);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_date_fns_start_of_week__ = __webpack_require__(18);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_date_fns_start_of_week___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_date_fns_start_of_week__);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_date_fns_add_days__ = __webpack_require__(0);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_date_fns_add_days___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_date_fns_add_days__);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_date_fns_end_of_week__ = __webpack_require__(8);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_date_fns_end_of_week___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_date_fns_end_of_week__);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_date_fns_difference_in_seconds__ = __webpack_require__(5);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_date_fns_difference_in_seconds___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_date_fns_difference_in_seconds__);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_date_fns_start_of_month__ = __webpack_require__(17);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_date_fns_start_of_month___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_date_fns_start_of_month__);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_date_fns_end_of_month__ = __webpack_require__(7);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_date_fns_end_of_month___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_date_fns_end_of_month__);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_date_fns_is_same_month__ = __webpack_require__(11);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_date_fns_is_same_month___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_date_fns_is_same_month__);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_date_fns_is_same_second__ = __webpack_require__(12);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_date_fns_is_same_second___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_date_fns_is_same_second__);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_date_fns_set_hours__ = __webpack_require__(13);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_date_fns_set_hours___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_date_fns_set_hours__);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_date_fns_set_minutes__ = __webpack_require__(14);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_date_fns_set_minutes___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_date_fns_set_minutes__);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_date_fns_start_of_minute__ = __webpack_require__(16);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_date_fns_start_of_minute___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16_date_fns_start_of_minute__);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17_date_fns_difference_in_minutes__ = __webpack_require__(4);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17_date_fns_difference_in_minutes___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_17_date_fns_difference_in_minutes__);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_date_fns_add_hours__ = __webpack_require__(1);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_date_fns_add_hours___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_18_date_fns_add_hours__);
	/* harmony export (binding) */ __webpack_require__.d(exports, "getWeekViewEventOffset", function() { return getWeekViewEventOffset; });
	/* harmony export (binding) */ __webpack_require__.d(exports, "getWeekViewHeader", function() { return getWeekViewHeader; });
	/* harmony export (binding) */ __webpack_require__.d(exports, "getWeekView", function() { return getWeekView; });
	/* harmony export (binding) */ __webpack_require__.d(exports, "getMonthView", function() { return getMonthView; });
	/* harmony export (binding) */ __webpack_require__.d(exports, "getDayView", function() { return getDayView; });
	/* harmony export (binding) */ __webpack_require__.d(exports, "getDayViewHourGrid", function() { return getDayViewHourGrid; });



















	var WEEKEND_DAY_NUMBERS = [0, 6];
	var DAYS_IN_WEEK = 7;
	var HOURS_IN_DAY = 24;
	var MINUTES_IN_HOUR = 60;
	var getWeekViewEventSpan = function (event, offset, startOfWeek) {
	    var span = 1;
	    if (event.end) {
	        var begin = event.start < startOfWeek ? startOfWeek : event.start;
	        span = __WEBPACK_IMPORTED_MODULE_2_date_fns_difference_in_days___default()(__WEBPACK_IMPORTED_MODULE_1_date_fns_add_minutes___default()(__WEBPACK_IMPORTED_MODULE_0_date_fns_end_of_day___default()(event.end), 1), __WEBPACK_IMPORTED_MODULE_3_date_fns_start_of_day___default()(begin));
	        if (span > DAYS_IN_WEEK) {
	            span = DAYS_IN_WEEK;
	        }
	    }
	    var totalLength = offset + span;
	    if (totalLength > DAYS_IN_WEEK) {
	        span -= (totalLength - DAYS_IN_WEEK);
	    }
	    return span;
	};
	var getWeekViewEventOffset = function (event, startOfWeek) {
	    var offset = 0;
	    if (__WEBPACK_IMPORTED_MODULE_3_date_fns_start_of_day___default()(event.start) > startOfWeek) {
	        offset = __WEBPACK_IMPORTED_MODULE_2_date_fns_difference_in_days___default()(__WEBPACK_IMPORTED_MODULE_3_date_fns_start_of_day___default()(event.start), startOfWeek);
	    }
	    return offset;
	};
	var isEventIsPeriod = function (_a) {
	    var event = _a.event, periodStart = _a.periodStart, periodEnd = _a.periodEnd;
	    var eventStart = event.start;
	    var eventEnd = event.end || event.start;
	    if (eventStart > periodStart && eventStart < periodEnd) {
	        return true;
	    }
	    if (eventEnd > periodStart && eventEnd < periodEnd) {
	        return true;
	    }
	    if (eventStart < periodStart && eventEnd > periodEnd) {
	        return true;
	    }
	    if (__WEBPACK_IMPORTED_MODULE_13_date_fns_is_same_second___default()(eventStart, periodStart) || __WEBPACK_IMPORTED_MODULE_13_date_fns_is_same_second___default()(eventStart, periodEnd)) {
	        return true;
	    }
	    if (__WEBPACK_IMPORTED_MODULE_13_date_fns_is_same_second___default()(eventEnd, periodStart) || __WEBPACK_IMPORTED_MODULE_13_date_fns_is_same_second___default()(eventEnd, periodEnd)) {
	        return true;
	    }
	    return false;
	};
	var getEventsInPeriod = function (_a) {
	    var events = _a.events, periodStart = _a.periodStart, periodEnd = _a.periodEnd;
	    return events.filter(function (event) { return isEventIsPeriod({ event: event, periodStart: periodStart, periodEnd: periodEnd }); });
	};
	var getWeekDay = function (_a) {
	    var date = _a.date;
	    var today = __WEBPACK_IMPORTED_MODULE_3_date_fns_start_of_day___default()(new Date());
	    return {
	        date: date,
	        isPast: date < today,
	        isToday: __WEBPACK_IMPORTED_MODULE_4_date_fns_is_same_day___default()(date, today),
	        isFuture: date > today,
	        isWeekend: WEEKEND_DAY_NUMBERS.indexOf(__WEBPACK_IMPORTED_MODULE_5_date_fns_get_day___default()(date)) > -1
	    };
	};
	var getWeekViewHeader = function (_a) {
	    var viewDate = _a.viewDate, weekStartsOn = _a.weekStartsOn;
	    var start = __WEBPACK_IMPORTED_MODULE_6_date_fns_start_of_week___default()(viewDate, { weekStartsOn: weekStartsOn });
	    var days = [];
	    for (var i = 0; i < DAYS_IN_WEEK; i++) {
	        var date = __WEBPACK_IMPORTED_MODULE_7_date_fns_add_days___default()(start, i);
	        days.push(getWeekDay({ date: date }));
	    }
	    return days;
	};
	var getWeekView = function (_a) {
	    var events = _a.events, viewDate = _a.viewDate, weekStartsOn = _a.weekStartsOn;
	    var startOfViewWeek = __WEBPACK_IMPORTED_MODULE_6_date_fns_start_of_week___default()(viewDate, { weekStartsOn: weekStartsOn });
	    var endOfViewWeek = __WEBPACK_IMPORTED_MODULE_8_date_fns_end_of_week___default()(viewDate, { weekStartsOn: weekStartsOn });
	    var eventsMapped = getEventsInPeriod({ events: events, periodStart: startOfViewWeek, periodEnd: endOfViewWeek }).map(function (event) {
	        var offset = getWeekViewEventOffset(event, startOfViewWeek);
	        var span = getWeekViewEventSpan(event, offset, startOfViewWeek);
	        return {
	            event: event,
	            offset: offset,
	            span: span,
	            startsBeforeWeek: event.start < startOfViewWeek,
	            endsAfterWeek: (event.end || event.start) > endOfViewWeek
	        };
	    }).sort(function (itemA, itemB) {
	        var startSecondsDiff = __WEBPACK_IMPORTED_MODULE_9_date_fns_difference_in_seconds___default()(itemA.event.start, itemB.event.start);
	        if (startSecondsDiff === 0) {
	            return __WEBPACK_IMPORTED_MODULE_9_date_fns_difference_in_seconds___default()(itemB.event.end || itemB.event.start, itemA.event.end || itemA.event.start);
	        }
	        return startSecondsDiff;
	    });
	    var eventRows = [];
	    var allocatedEvents = [];
	    eventsMapped.forEach(function (event, index) {
	        if (allocatedEvents.indexOf(event) === -1) {
	            allocatedEvents.push(event);
	            var rowSpan_1 = event.span + event.offset;
	            var otherRowEvents = eventsMapped.slice(index + 1).filter(function (nextEvent) {
	                if (nextEvent.offset >= rowSpan_1 &&
	                    rowSpan_1 + nextEvent.span <= DAYS_IN_WEEK &&
	                    allocatedEvents.indexOf(nextEvent) === -1) {
	                    nextEvent.offset -= rowSpan_1;
	                    rowSpan_1 += nextEvent.span + nextEvent.offset;
	                    allocatedEvents.push(nextEvent);
	                    return true;
	                }
	            });
	            eventRows.push({
	                row: [
	                    event
	                ].concat(otherRowEvents)
	            });
	        }
	    });
	    return eventRows;
	};
	var getMonthView = function (_a) {
	    var events = _a.events, viewDate = _a.viewDate, weekStartsOn = _a.weekStartsOn;
	    var start = __WEBPACK_IMPORTED_MODULE_6_date_fns_start_of_week___default()(__WEBPACK_IMPORTED_MODULE_10_date_fns_start_of_month___default()(viewDate), { weekStartsOn: weekStartsOn });
	    var end = __WEBPACK_IMPORTED_MODULE_8_date_fns_end_of_week___default()(__WEBPACK_IMPORTED_MODULE_11_date_fns_end_of_month___default()(viewDate), { weekStartsOn: weekStartsOn });
	    var eventsInMonth = getEventsInPeriod({
	        events: events,
	        periodStart: start,
	        periodEnd: end
	    });
	    var days = [];
	    for (var i = 0; i < __WEBPACK_IMPORTED_MODULE_2_date_fns_difference_in_days___default()(end, start) + 1; i++) {
	        var date = __WEBPACK_IMPORTED_MODULE_7_date_fns_add_days___default()(start, i);
	        var day = getWeekDay({ date: date });
	        var events_1 = getEventsInPeriod({
	            events: eventsInMonth,
	            periodStart: __WEBPACK_IMPORTED_MODULE_3_date_fns_start_of_day___default()(date),
	            periodEnd: __WEBPACK_IMPORTED_MODULE_0_date_fns_end_of_day___default()(date)
	        });
	        day.inMonth = __WEBPACK_IMPORTED_MODULE_12_date_fns_is_same_month___default()(date, viewDate);
	        day.events = events_1;
	        day.badgeTotal = events_1.length;
	        days.push(day);
	    }
	    var rows = Math.floor(days.length / 7);
	    var rowOffsets = [];
	    for (var i = 0; i < rows; i++) {
	        rowOffsets.push(i * 7);
	    }
	    return {
	        rowOffsets: rowOffsets,
	        days: days
	    };
	};
	var getDayView = function (_a) {
	    var events = _a.events, viewDate = _a.viewDate, hourSegments = _a.hourSegments, dayStart = _a.dayStart, dayEnd = _a.dayEnd, eventWidth = _a.eventWidth, segmentHeight = _a.segmentHeight;
	    var startOfView = __WEBPACK_IMPORTED_MODULE_15_date_fns_set_minutes___default()(__WEBPACK_IMPORTED_MODULE_14_date_fns_set_hours___default()(__WEBPACK_IMPORTED_MODULE_3_date_fns_start_of_day___default()(viewDate), dayStart.hour), dayStart.minute);
	    var endOfView = __WEBPACK_IMPORTED_MODULE_15_date_fns_set_minutes___default()(__WEBPACK_IMPORTED_MODULE_14_date_fns_set_hours___default()(__WEBPACK_IMPORTED_MODULE_16_date_fns_start_of_minute___default()(__WEBPACK_IMPORTED_MODULE_0_date_fns_end_of_day___default()(viewDate)), dayEnd.hour), dayEnd.minute);
	    var previousDayEvents = [];
	    var dayViewEvents = getEventsInPeriod({
	        events: events.filter(function (event) { return !event.allDay; }),
	        periodStart: startOfView,
	        periodEnd: endOfView
	    }).sort(function (eventA, eventB) {
	        return eventA.start.valueOf() - eventB.start.valueOf();
	    }).map(function (event) {
	        var eventStart = event.start;
	        var eventEnd = event.end || eventStart;
	        var startsBeforeDay = eventStart < startOfView;
	        var endsAfterDay = eventEnd > endOfView;
	        var hourHeightModifier = (hourSegments * segmentHeight) / MINUTES_IN_HOUR;
	        var top = 0;
	        if (eventStart > startOfView) {
	            top += __WEBPACK_IMPORTED_MODULE_17_date_fns_difference_in_minutes___default()(eventStart, startOfView);
	        }
	        top *= hourHeightModifier;
	        var startDate = startsBeforeDay ? startOfView : eventStart;
	        var endDate = endsAfterDay ? endOfView : eventEnd;
	        var height = __WEBPACK_IMPORTED_MODULE_17_date_fns_difference_in_minutes___default()(endDate, startDate);
	        if (!event.end) {
	            height = segmentHeight;
	        }
	        else {
	            height *= hourHeightModifier;
	        }
	        var bottom = top + height;
	        var overlappingPreviousEvents = previousDayEvents.filter(function (previousEvent) {
	            var previousEventTop = previousEvent.top;
	            var previousEventBottom = previousEvent.top + previousEvent.height;
	            if (top < previousEventBottom && previousEventBottom < bottom) {
	                return true;
	            }
	            else if (previousEventTop <= top && bottom <= previousEventBottom) {
	                return true;
	            }
	            return false;
	        });
	        var left = 0;
	        while (overlappingPreviousEvents.some(function (previousEvent) { return previousEvent.left === left; })) {
	            left += eventWidth;
	        }
	        var dayEvent = {
	            event: event,
	            height: height,
	            width: eventWidth,
	            top: top,
	            left: left,
	            startsBeforeDay: startsBeforeDay,
	            endsAfterDay: endsAfterDay
	        };
	        if (height > 0) {
	            previousDayEvents.push(dayEvent);
	        }
	        return dayEvent;
	    }).filter(function (dayEvent) { return dayEvent.height > 0; });
	    var width = Math.max.apply(Math, dayViewEvents.map(function (event) { return event.left + event.width; }));
	    var allDayEvents = getEventsInPeriod({
	        events: events.filter(function (event) { return event.allDay; }),
	        periodStart: __WEBPACK_IMPORTED_MODULE_3_date_fns_start_of_day___default()(startOfView),
	        periodEnd: __WEBPACK_IMPORTED_MODULE_0_date_fns_end_of_day___default()(endOfView)
	    });
	    return {
	        events: dayViewEvents,
	        width: width,
	        allDayEvents: allDayEvents
	    };
	};
	var getDayViewHourGrid = function (_a) {
	    var viewDate = _a.viewDate, hourSegments = _a.hourSegments, dayStart = _a.dayStart, dayEnd = _a.dayEnd;
	    var hours = [];
	    var startOfView = __WEBPACK_IMPORTED_MODULE_15_date_fns_set_minutes___default()(__WEBPACK_IMPORTED_MODULE_14_date_fns_set_hours___default()(__WEBPACK_IMPORTED_MODULE_3_date_fns_start_of_day___default()(viewDate), dayStart.hour), dayStart.minute);
	    var endOfView = __WEBPACK_IMPORTED_MODULE_15_date_fns_set_minutes___default()(__WEBPACK_IMPORTED_MODULE_14_date_fns_set_hours___default()(__WEBPACK_IMPORTED_MODULE_16_date_fns_start_of_minute___default()(__WEBPACK_IMPORTED_MODULE_0_date_fns_end_of_day___default()(viewDate)), dayEnd.hour), dayEnd.minute);
	    var segmentDuration = MINUTES_IN_HOUR / hourSegments;
	    var startOfViewDay = __WEBPACK_IMPORTED_MODULE_3_date_fns_start_of_day___default()(viewDate);
	    for (var i = 0; i < HOURS_IN_DAY; i++) {
	        var segments = [];
	        for (var j = 0; j < hourSegments; j++) {
	            var date = __WEBPACK_IMPORTED_MODULE_1_date_fns_add_minutes___default()(__WEBPACK_IMPORTED_MODULE_18_date_fns_add_hours___default()(startOfViewDay, i), j * segmentDuration);
	            if (date >= startOfView && date < endOfView) {
	                segments.push({
	                    date: date,
	                    isStart: j === 0
	                });
	            }
	        }
	        if (segments.length > 0) {
	            hours.push({ segments: segments });
	        }
	    }
	    return hours;
	};


	/***/ }
	/******/ ])
	});
	;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var parse = __webpack_require__(27)

	/**
	 * @category Day Helpers
	 * @summary Add the specified number of days to the given date.
	 *
	 * @description
	 * Add the specified number of days to the given date.
	 *
	 * @param {Date|String|Number} date - the date to be changed
	 * @param {Number} amount - the amount of days to be added
	 * @returns {Date} the new date with the days added
	 *
	 * @example
	 * // Add 10 days to 1 September 2014:
	 * var result = addDays(new Date(2014, 8, 1), 10)
	 * //=> Thu Sep 11 2014 00:00:00
	 */
	function addDays (dirtyDate, amount) {
	  var date = parse(dirtyDate)
	  date.setDate(date.getDate() + amount)
	  return date
	}

	module.exports = addDays


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var isDate = __webpack_require__(28)

	var MILLISECONDS_IN_HOUR = 3600000
	var MILLISECONDS_IN_MINUTE = 60000
	var DEFAULT_ADDITIONAL_DIGITS = 2

	var parseTokenDateTimeDelimeter = /[T ]/
	var parseTokenPlainTime = /:/

	// year tokens
	var parseTokenYY = /^(\d{2})$/
	var parseTokensYYY = [
	  /^([+-]\d{2})$/, // 0 additional digits
	  /^([+-]\d{3})$/, // 1 additional digit
	  /^([+-]\d{4})$/ // 2 additional digits
	]

	var parseTokenYYYY = /^(\d{4})/
	var parseTokensYYYYY = [
	  /^([+-]\d{4})/, // 0 additional digits
	  /^([+-]\d{5})/, // 1 additional digit
	  /^([+-]\d{6})/ // 2 additional digits
	]

	// date tokens
	var parseTokenMM = /^-(\d{2})$/
	var parseTokenDDD = /^-?(\d{3})$/
	var parseTokenMMDD = /^-?(\d{2})-?(\d{2})$/
	var parseTokenWww = /^-?W(\d{2})$/
	var parseTokenWwwD = /^-?W(\d{2})-?(\d{1})$/

	// time tokens
	var parseTokenHH = /^(\d{2}([.,]\d*)?)$/
	var parseTokenHHMM = /^(\d{2}):?(\d{2}([.,]\d*)?)$/
	var parseTokenHHMMSS = /^(\d{2}):?(\d{2}):?(\d{2}([.,]\d*)?)$/

	// timezone tokens
	var parseTokenTimezone = /([Z+-].*)$/
	var parseTokenTimezoneZ = /^(Z)$/
	var parseTokenTimezoneHH = /^([+-])(\d{2})$/
	var parseTokenTimezoneHHMM = /^([+-])(\d{2}):?(\d{2})$/

	/**
	 * @category Common Helpers
	 * @summary Parse the ISO-8601-formatted date.
	 *
	 * @description
	 * Parse the date string representation.
	 * It accepts complete ISO 8601 formats as well as partial implementations.
	 *
	 * ISO 8601: http://en.wikipedia.org/wiki/ISO_8601
	 *
	 * @param {String} dateString - the ISO 8601 formatted string to parse
	 * @param {Object} [options] - the object with options
	 * @param {Number} [options.additionalDigits=2] - the additional number of digits in the extended year format: 0, 1, or 2
	 * @returns {Date} the parsed date in the local time zone
	 *
	 * @example
	 * // Parse string '2014-02-11T11:30:30':
	 * var result = parse('2014-02-11T11:30:30')
	 * //=> Tue Feb 11 2014 11:30:30
	 *
	 * @example
	 * // Parse string '+02014101',
	 * // if the additional number of digits in the extended year format is 1:
	 * var result = parse('+02014101', {additionalDigits: 1})
	 * //=> Fri Apr 11 2014 00:00:00
	 */
	function parse (dateString, options) {
	  if (isDate(dateString)) {
	    // Prevent the date to lose the milliseconds when passed to new Date() in IE10
	    return new Date(dateString.getTime())
	  } else if (typeof dateString !== 'string') {
	    return new Date(dateString)
	  }

	  options = options || {}
	  var additionalDigits = options.additionalDigits
	  if (additionalDigits == null) {
	    additionalDigits = DEFAULT_ADDITIONAL_DIGITS
	  }

	  var dateStrings = splitDateString(dateString)

	  var parseYearResult = parseYear(dateStrings.date, additionalDigits)
	  var year = parseYearResult.year
	  var restDateString = parseYearResult.restDateString

	  var date = parseDate(restDateString, year)

	  if (date) {
	    var timestamp = date.getTime()
	    var time = 0
	    var offset

	    if (dateStrings.time) {
	      time = parseTime(dateStrings.time)
	    }

	    if (dateStrings.timezone) {
	      offset = parseTimezone(dateStrings.timezone)
	    } else {
	      // get offset accurate to hour in timezones that change offset
	      offset = new Date(timestamp + time).getTimezoneOffset()
	      offset = new Date(timestamp + time + offset * MILLISECONDS_IN_MINUTE).getTimezoneOffset()
	    }

	    return new Date(timestamp + time + offset * MILLISECONDS_IN_MINUTE)
	  } else {
	    return new Date(dateString)
	  }
	}

	function splitDateString (dateString) {
	  var dateStrings = {}
	  var array = dateString.split(parseTokenDateTimeDelimeter)
	  var timeString

	  if (parseTokenPlainTime.test(array[0])) {
	    dateStrings.date = null
	    timeString = array[0]
	  } else {
	    dateStrings.date = array[0]
	    timeString = array[1]
	  }

	  if (timeString) {
	    var token = parseTokenTimezone.exec(timeString)
	    if (token) {
	      dateStrings.time = timeString.replace(token[1], '')
	      dateStrings.timezone = token[1]
	    } else {
	      dateStrings.time = timeString
	    }
	  }

	  return dateStrings
	}

	function parseYear (dateString, additionalDigits) {
	  var parseTokenYYY = parseTokensYYY[additionalDigits]
	  var parseTokenYYYYY = parseTokensYYYYY[additionalDigits]

	  var token

	  // YYYY or ±YYYYY
	  token = parseTokenYYYY.exec(dateString) || parseTokenYYYYY.exec(dateString)
	  if (token) {
	    var yearString = token[1]
	    return {
	      year: parseInt(yearString, 10),
	      restDateString: dateString.slice(yearString.length)
	    }
	  }

	  // YY or ±YYY
	  token = parseTokenYY.exec(dateString) || parseTokenYYY.exec(dateString)
	  if (token) {
	    var centuryString = token[1]
	    return {
	      year: parseInt(centuryString, 10) * 100,
	      restDateString: dateString.slice(centuryString.length)
	    }
	  }

	  // Invalid ISO-formatted year
	  return {
	    year: null
	  }
	}

	function parseDate (dateString, year) {
	  // Invalid ISO-formatted year
	  if (year === null) {
	    return null
	  }

	  var token
	  var date
	  var month
	  var week

	  // YYYY
	  if (dateString.length === 0) {
	    date = new Date(0)
	    date.setUTCFullYear(year)
	    return date
	  }

	  // YYYY-MM
	  token = parseTokenMM.exec(dateString)
	  if (token) {
	    date = new Date(0)
	    month = parseInt(token[1], 10) - 1
	    date.setUTCFullYear(year, month)
	    return date
	  }

	  // YYYY-DDD or YYYYDDD
	  token = parseTokenDDD.exec(dateString)
	  if (token) {
	    date = new Date(0)
	    var dayOfYear = parseInt(token[1], 10)
	    date.setUTCFullYear(year, 0, dayOfYear)
	    return date
	  }

	  // YYYY-MM-DD or YYYYMMDD
	  token = parseTokenMMDD.exec(dateString)
	  if (token) {
	    date = new Date(0)
	    month = parseInt(token[1], 10) - 1
	    var day = parseInt(token[2], 10)
	    date.setUTCFullYear(year, month, day)
	    return date
	  }

	  // YYYY-Www or YYYYWww
	  token = parseTokenWww.exec(dateString)
	  if (token) {
	    week = parseInt(token[1], 10) - 1
	    return dayOfISOYear(year, week)
	  }

	  // YYYY-Www-D or YYYYWwwD
	  token = parseTokenWwwD.exec(dateString)
	  if (token) {
	    week = parseInt(token[1], 10) - 1
	    var dayOfWeek = parseInt(token[2], 10) - 1
	    return dayOfISOYear(year, week, dayOfWeek)
	  }

	  // Invalid ISO-formatted date
	  return null
	}

	function parseTime (timeString) {
	  var token
	  var hours
	  var minutes

	  // hh
	  token = parseTokenHH.exec(timeString)
	  if (token) {
	    hours = parseFloat(token[1].replace(',', '.'))
	    return (hours % 24) * MILLISECONDS_IN_HOUR
	  }

	  // hh:mm or hhmm
	  token = parseTokenHHMM.exec(timeString)
	  if (token) {
	    hours = parseInt(token[1], 10)
	    minutes = parseFloat(token[2].replace(',', '.'))
	    return (hours % 24) * MILLISECONDS_IN_HOUR +
	      minutes * MILLISECONDS_IN_MINUTE
	  }

	  // hh:mm:ss or hhmmss
	  token = parseTokenHHMMSS.exec(timeString)
	  if (token) {
	    hours = parseInt(token[1], 10)
	    minutes = parseInt(token[2], 10)
	    var seconds = parseFloat(token[3].replace(',', '.'))
	    return (hours % 24) * MILLISECONDS_IN_HOUR +
	      minutes * MILLISECONDS_IN_MINUTE +
	      seconds * 1000
	  }

	  // Invalid ISO-formatted time
	  return null
	}

	function parseTimezone (timezoneString) {
	  var token
	  var absoluteOffset

	  // Z
	  token = parseTokenTimezoneZ.exec(timezoneString)
	  if (token) {
	    return 0
	  }

	  // ±hh
	  token = parseTokenTimezoneHH.exec(timezoneString)
	  if (token) {
	    absoluteOffset = parseInt(token[2], 10) * 60
	    return (token[1] === '+') ? -absoluteOffset : absoluteOffset
	  }

	  // ±hh:mm or ±hhmm
	  token = parseTokenTimezoneHHMM.exec(timezoneString)
	  if (token) {
	    absoluteOffset = parseInt(token[2], 10) * 60 + parseInt(token[3], 10)
	    return (token[1] === '+') ? -absoluteOffset : absoluteOffset
	  }

	  return 0
	}

	function dayOfISOYear (isoYear, week, day) {
	  week = week || 0
	  day = day || 0
	  var date = new Date(0)
	  date.setUTCFullYear(isoYear, 0, 4)
	  var diff = week * 7 + day + 1 - date.getUTCDay()
	  date.setUTCDate(date.getUTCDate() + diff)
	  return date
	}

	module.exports = parse


/***/ },
/* 28 */
/***/ function(module, exports) {

	/**
	 * @category Common Helpers
	 * @summary Is the given argument an instance of Date?
	 *
	 * @description
	 * Is the given argument an instance of Date?
	 *
	 * @param {*} argument - the argument to check
	 * @returns {Boolean} the given argument is an instance of Date
	 *
	 * @example
	 * // Is 'mayonnaise' a Date?
	 * var result = isDate('mayonnaise')
	 * //=> false
	 */
	function isDate (argument) {
	  return argument instanceof Date
	}

	module.exports = isDate


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var parse = __webpack_require__(27)

	/**
	 * @category Hour Helpers
	 * @summary Add the specified number of hours to the given date.
	 *
	 * @description
	 * Add the specified number of hours to the given date.
	 *
	 * @param {Date|String|Number} date - the date to be changed
	 * @param {Number} amount - the amount of hours to be added
	 * @returns {Date} the new date with the hours added
	 *
	 * @example
	 * // Add 2 hours to 10 July 2014 23:00:00:
	 * var result = addHours(new Date(2014, 6, 10, 23, 0), 2)
	 * //=> Fri Jul 11 2014 01:00:00
	 */
	function addHours (dirtyDate, amount) {
	  var date = parse(dirtyDate)
	  date.setHours(date.getHours() + amount)
	  return date
	}

	module.exports = addHours


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var parse = __webpack_require__(27)

	/**
	 * @category Minute Helpers
	 * @summary Add the specified number of minutes to the given date.
	 *
	 * @description
	 * Add the specified number of minutes to the given date.
	 *
	 * @param {Date|String|Number} date - the date to be changed
	 * @param {Number} amount - the amount of minutes to be added
	 * @returns {Date} the new date with the minutes added
	 *
	 * @example
	 * // Add 30 minutes to 10 July 2014 12:00:00:
	 * var result = addMinutes(new Date(2014, 6, 10, 12, 0), 30)
	 * //=> Thu Jul 10 2014 12:30:00
	 */
	function addMinutes (dirtyDate, amount) {
	  var date = parse(dirtyDate)
	  date.setMinutes(date.getMinutes() + amount)
	  return date
	}

	module.exports = addMinutes


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var parse = __webpack_require__(27)
	var differenceInCalendarDays = __webpack_require__(32)
	var compareAsc = __webpack_require__(34)

	/**
	 * @category Day Helpers
	 * @summary Get the number of full days between the given dates.
	 *
	 * @description
	 * Get the number of full days between the given dates.
	 *
	 * @param {Date|String|Number} dateLeft - the later date
	 * @param {Date|String|Number} dateRight - the earlier date
	 * @returns {Number} the number of full days
	 *
	 * @example
	 * // How many full days are between
	 * // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
	 * var result = differenceInDays(
	 *   new Date(2012, 6, 2, 0, 0),
	 *   new Date(2011, 6, 2, 23, 0)
	 * )
	 * //=> 365
	 */
	function differenceInDays (dirtyDateLeft, dirtyDateRight) {
	  var dateLeft = parse(dirtyDateLeft)
	  var dateRight = parse(dirtyDateRight)

	  var sign = compareAsc(dateLeft, dateRight)
	  var difference = Math.abs(differenceInCalendarDays(dateLeft, dateRight))
	  dateLeft.setDate(dateLeft.getDate() - sign * difference)

	  // Math.abs(diff in full days - diff in calendar days) === 1 if last calendar day is not full
	  // If so, result must be decreased by 1 in absolute value
	  var isLastDayNotFull = compareAsc(dateLeft, dateRight) === -sign
	  return sign * (difference - isLastDayNotFull)
	}

	module.exports = differenceInDays


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var startOfDay = __webpack_require__(33)

	var MILLISECONDS_IN_MINUTE = 60000
	var MILLISECONDS_IN_DAY = 86400000

	/**
	 * @category Day Helpers
	 * @summary Get the number of calendar days between the given dates.
	 *
	 * @description
	 * Get the number of calendar days between the given dates.
	 *
	 * @param {Date|String|Number} dateLeft - the later date
	 * @param {Date|String|Number} dateRight - the earlier date
	 * @returns {Number} the number of calendar days
	 *
	 * @example
	 * // How many calendar days are between
	 * // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
	 * var result = differenceInCalendarDays(
	 *   new Date(2012, 6, 2, 0, 0),
	 *   new Date(2011, 6, 2, 23, 0)
	 * )
	 * //=> 366
	 */
	function differenceInCalendarDays (dirtyDateLeft, dirtyDateRight) {
	  var startOfDayLeft = startOfDay(dirtyDateLeft)
	  var startOfDayRight = startOfDay(dirtyDateRight)

	  var timestampLeft = startOfDayLeft.getTime() -
	    startOfDayLeft.getTimezoneOffset() * MILLISECONDS_IN_MINUTE
	  var timestampRight = startOfDayRight.getTime() -
	    startOfDayRight.getTimezoneOffset() * MILLISECONDS_IN_MINUTE

	  // Round the number of days to the nearest integer
	  // because the number of milliseconds in a day is not constant
	  // (e.g. it's different in the day of the daylight saving time clock shift)
	  return Math.round((timestampLeft - timestampRight) / MILLISECONDS_IN_DAY)
	}

	module.exports = differenceInCalendarDays


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var parse = __webpack_require__(27)

	/**
	 * @category Day Helpers
	 * @summary Return the start of a day for the given date.
	 *
	 * @description
	 * Return the start of a day for the given date.
	 * The result will be in the local timezone.
	 *
	 * @param {Date|String|Number} date - the original date
	 * @returns {Date} the start of a day
	 *
	 * @example
	 * // The start of a day for 2 September 2014 11:55:00:
	 * var result = startOfDay(new Date(2014, 8, 2, 11, 55, 0))
	 * //=> Tue Sep 02 2014 00:00:00
	 */
	function startOfDay (dirtyDate) {
	  var date = parse(dirtyDate)
	  date.setHours(0, 0, 0, 0)
	  return date
	}

	module.exports = startOfDay


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var parse = __webpack_require__(27)

	/**
	 * @category Common Helpers
	 * @summary Compare the two dates and return -1, 0 or 1.
	 *
	 * @description
	 * Compare the two dates and return 1 if the first date is after the second,
	 * -1 if the first date is before the second or 0 if dates are equal.
	 *
	 * @param {Date|String|Number} dateLeft - the first date to compare
	 * @param {Date|String|Number} dateRight - the second date to compare
	 * @returns {Number} the result of the comparison
	 *
	 * @example
	 * // Compare 11 February 1987 and 10 July 1989:
	 * var result = compareAsc(
	 *   new Date(1987, 1, 11),
	 *   new Date(1989, 6, 10)
	 * )
	 * //=> -1
	 *
	 * @example
	 * // Sort the array of dates:
	 * var result = [
	 *   new Date(1995, 6, 2),
	 *   new Date(1987, 1, 11),
	 *   new Date(1989, 6, 10)
	 * ].sort(compareAsc)
	 * //=> [
	 * //   Wed Feb 11 1987 00:00:00,
	 * //   Mon Jul 10 1989 00:00:00,
	 * //   Sun Jul 02 1995 00:00:00
	 * // ]
	 */
	function compareAsc (dirtyDateLeft, dirtyDateRight) {
	  var dateLeft = parse(dirtyDateLeft)
	  var timeLeft = dateLeft.getTime()
	  var dateRight = parse(dirtyDateRight)
	  var timeRight = dateRight.getTime()

	  if (timeLeft < timeRight) {
	    return -1
	  } else if (timeLeft > timeRight) {
	    return 1
	  } else {
	    return 0
	  }
	}

	module.exports = compareAsc


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var differenceInMilliseconds = __webpack_require__(36)

	var MILLISECONDS_IN_MINUTE = 60000

	/**
	 * @category Minute Helpers
	 * @summary Get the number of minutes between the given dates.
	 *
	 * @description
	 * Get the number of minutes between the given dates.
	 *
	 * @param {Date|String|Number} dateLeft - the later date
	 * @param {Date|String|Number} dateRight - the earlier date
	 * @returns {Number} the number of minutes
	 *
	 * @example
	 * // How many minutes are between 2 July 2014 12:07:59 and 2 July 2014 12:20:00?
	 * var result = differenceInMinutes(
	 *   new Date(2014, 6, 2, 12, 20, 0),
	 *   new Date(2014, 6, 2, 12, 7, 59)
	 * )
	 * //=> 12
	 */
	function differenceInMinutes (dirtyDateLeft, dirtyDateRight) {
	  var diff = differenceInMilliseconds(dirtyDateLeft, dirtyDateRight) / MILLISECONDS_IN_MINUTE
	  return diff > 0 ? Math.floor(diff) : Math.ceil(diff)
	}

	module.exports = differenceInMinutes


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var parse = __webpack_require__(27)

	/**
	 * @category Millisecond Helpers
	 * @summary Get the number of milliseconds between the given dates.
	 *
	 * @description
	 * Get the number of milliseconds between the given dates.
	 *
	 * @param {Date|String|Number} dateLeft - the later date
	 * @param {Date|String|Number} dateRight - the earlier date
	 * @returns {Number} the number of milliseconds
	 *
	 * @example
	 * // How many milliseconds are between
	 * // 2 July 2014 12:30:20.600 and 2 July 2014 12:30:21.700?
	 * var result = differenceInMilliseconds(
	 *   new Date(2014, 6, 2, 12, 30, 21, 700),
	 *   new Date(2014, 6, 2, 12, 30, 20, 600)
	 * )
	 * //=> 1100
	 */
	function differenceInMilliseconds (dirtyDateLeft, dirtyDateRight) {
	  var dateLeft = parse(dirtyDateLeft)
	  var dateRight = parse(dirtyDateRight)
	  return dateLeft.getTime() - dateRight.getTime()
	}

	module.exports = differenceInMilliseconds


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var differenceInMilliseconds = __webpack_require__(36)

	/**
	 * @category Second Helpers
	 * @summary Get the number of seconds between the given dates.
	 *
	 * @description
	 * Get the number of seconds between the given dates.
	 *
	 * @param {Date|String|Number} dateLeft - the later date
	 * @param {Date|String|Number} dateRight - the earlier date
	 * @returns {Number} the number of seconds
	 *
	 * @example
	 * // How many seconds are between
	 * // 2 July 2014 12:30:07.999 and 2 July 2014 12:30:20.000?
	 * var result = differenceInSeconds(
	 *   new Date(2014, 6, 2, 12, 30, 20, 0),
	 *   new Date(2014, 6, 2, 12, 30, 7, 999)
	 * )
	 * //=> 12
	 */
	function differenceInSeconds (dirtyDateLeft, dirtyDateRight) {
	  var diff = differenceInMilliseconds(dirtyDateLeft, dirtyDateRight) / 1000
	  return diff > 0 ? Math.floor(diff) : Math.ceil(diff)
	}

	module.exports = differenceInSeconds


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var parse = __webpack_require__(27)

	/**
	 * @category Day Helpers
	 * @summary Return the end of a day for the given date.
	 *
	 * @description
	 * Return the end of a day for the given date.
	 * The result will be in the local timezone.
	 *
	 * @param {Date|String|Number} date - the original date
	 * @returns {Date} the end of a day
	 *
	 * @example
	 * // The end of a day for 2 September 2014 11:55:00:
	 * var result = endOfDay(new Date(2014, 8, 2, 11, 55, 0))
	 * //=> Tue Sep 02 2014 23:59:59.999
	 */
	function endOfDay (dirtyDate) {
	  var date = parse(dirtyDate)
	  date.setHours(23, 59, 59, 999)
	  return date
	}

	module.exports = endOfDay


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var parse = __webpack_require__(27)

	/**
	 * @category Month Helpers
	 * @summary Return the end of a month for the given date.
	 *
	 * @description
	 * Return the end of a month for the given date.
	 * The result will be in the local timezone.
	 *
	 * @param {Date|String|Number} date - the original date
	 * @returns {Date} the end of a month
	 *
	 * @example
	 * // The end of a month for 2 September 2014 11:55:00:
	 * var result = endOfMonth(new Date(2014, 8, 2, 11, 55, 0))
	 * //=> Tue Sep 30 2014 23:59:59.999
	 */
	function endOfMonth (dirtyDate) {
	  var date = parse(dirtyDate)
	  var month = date.getMonth()
	  date.setFullYear(date.getFullYear(), month + 1, 0)
	  date.setHours(23, 59, 59, 999)
	  return date
	}

	module.exports = endOfMonth


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var parse = __webpack_require__(27)

	/**
	 * @category Week Helpers
	 * @summary Return the end of a week for the given date.
	 *
	 * @description
	 * Return the end of a week for the given date.
	 * The result will be in the local timezone.
	 *
	 * @param {Date|String|Number} date - the original date
	 * @param {Object} [options] - the object with options
	 * @param {Number} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
	 * @returns {Date} the end of a week
	 *
	 * @example
	 * // The end of a week for 2 September 2014 11:55:00:
	 * var result = endOfWeek(new Date(2014, 8, 2, 11, 55, 0))
	 * //=> Sat Sep 06 2014 23:59:59.999
	 *
	 * @example
	 * // If week starts at Monday, the end of a week for 2 September 2014 11:55:00:
	 * var result = endOfWeek(new Date(2014, 8, 2, 11, 55, 0), {weekStartsOn: 1})
	 * //=> Sun Sep 07 2014 23:59:59.999
	 */
	function endOfWeek (dirtyDate, options) {
	  var weekStartsOn = options ? (options.weekStartsOn || 0) : 0

	  var date = parse(dirtyDate)
	  var day = date.getDay()
	  var diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn)

	  date.setDate(date.getDate() + diff)
	  date.setHours(23, 59, 59, 999)
	  return date
	}

	module.exports = endOfWeek


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var parse = __webpack_require__(27)

	/**
	 * @category Weekday Helpers
	 * @summary Get the day of the week of the given date.
	 *
	 * @description
	 * Get the day of the week of the given date.
	 *
	 * @param {Date|String|Number} date - the given date
	 * @returns {Number} the day of week
	 *
	 * @example
	 * // Which day of the week is 29 February 2012?
	 * var result = getDay(new Date(2012, 1, 29))
	 * //=> 3
	 */
	function getDay (dirtyDate) {
	  var date = parse(dirtyDate)
	  var day = date.getDay()
	  return day
	}

	module.exports = getDay


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var startOfDay = __webpack_require__(33)

	/**
	 * @category Day Helpers
	 * @summary Are the given dates in the same day?
	 *
	 * @description
	 * Are the given dates in the same day?
	 *
	 * @param {Date|String|Number} dateLeft - the first date to check
	 * @param {Date|String|Number} dateRight - the second date to check
	 * @returns {Boolean} the dates are in the same day
	 *
	 * @example
	 * // Are 4 September 06:00:00 and 4 September 18:00:00 in the same day?
	 * var result = isSameDay(
	 *   new Date(2014, 8, 4, 6, 0),
	 *   new Date(2014, 8, 4, 18, 0)
	 * )
	 * //=> true
	 */
	function isSameDay (dirtyDateLeft, dirtyDateRight) {
	  var dateLeftStartOfDay = startOfDay(dirtyDateLeft)
	  var dateRightStartOfDay = startOfDay(dirtyDateRight)

	  return dateLeftStartOfDay.getTime() === dateRightStartOfDay.getTime()
	}

	module.exports = isSameDay


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var parse = __webpack_require__(27)

	/**
	 * @category Month Helpers
	 * @summary Are the given dates in the same month?
	 *
	 * @description
	 * Are the given dates in the same month?
	 *
	 * @param {Date|String|Number} dateLeft - the first date to check
	 * @param {Date|String|Number} dateRight - the second date to check
	 * @returns {Boolean} the dates are in the same month
	 *
	 * @example
	 * // Are 2 September 2014 and 25 September 2014 in the same month?
	 * var result = isSameMonth(
	 *   new Date(2014, 8, 2),
	 *   new Date(2014, 8, 25)
	 * )
	 * //=> true
	 */
	function isSameMonth (dirtyDateLeft, dirtyDateRight) {
	  var dateLeft = parse(dirtyDateLeft)
	  var dateRight = parse(dirtyDateRight)
	  return dateLeft.getFullYear() === dateRight.getFullYear() &&
	    dateLeft.getMonth() === dateRight.getMonth()
	}

	module.exports = isSameMonth


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var startOfSecond = __webpack_require__(45)

	/**
	 * @category Second Helpers
	 * @summary Are the given dates in the same second?
	 *
	 * @description
	 * Are the given dates in the same second?
	 *
	 * @param {Date|String|Number} dateLeft - the first date to check
	 * @param {Date|String|Number} dateRight - the second date to check
	 * @returns {Boolean} the dates are in the same second
	 *
	 * @example
	 * // Are 4 September 2014 06:30:15.000 and 4 September 2014 06:30.15.500
	 * // in the same second?
	 * var result = isSameSecond(
	 *   new Date(2014, 8, 4, 6, 30, 15),
	 *   new Date(2014, 8, 4, 6, 30, 15, 500)
	 * )
	 * //=> true
	 */
	function isSameSecond (dirtyDateLeft, dirtyDateRight) {
	  var dateLeftStartOfSecond = startOfSecond(dirtyDateLeft)
	  var dateRightStartOfSecond = startOfSecond(dirtyDateRight)

	  return dateLeftStartOfSecond.getTime() === dateRightStartOfSecond.getTime()
	}

	module.exports = isSameSecond


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var parse = __webpack_require__(27)

	/**
	 * @category Second Helpers
	 * @summary Return the start of a second for the given date.
	 *
	 * @description
	 * Return the start of a second for the given date.
	 * The result will be in the local timezone.
	 *
	 * @param {Date|String|Number} date - the original date
	 * @returns {Date} the start of a second
	 *
	 * @example
	 * // The start of a second for 1 December 2014 22:15:45.400:
	 * var result = startOfSecond(new Date(2014, 11, 1, 22, 15, 45, 400))
	 * //=> Mon Dec 01 2014 22:15:45.000
	 */
	function startOfSecond (dirtyDate) {
	  var date = parse(dirtyDate)
	  date.setMilliseconds(0)
	  return date
	}

	module.exports = startOfSecond


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var parse = __webpack_require__(27)

	/**
	 * @category Hour Helpers
	 * @summary Set the hours to the given date.
	 *
	 * @description
	 * Set the hours to the given date.
	 *
	 * @param {Date|String|Number} date - the date to be changed
	 * @param {Number} hours - the hours of the new date
	 * @returns {Date} the new date with the hours setted
	 *
	 * @example
	 * // Set 4 hours to 1 September 2014 11:30:00:
	 * var result = setHours(new Date(2014, 8, 1, 11, 30), 4)
	 * //=> Mon Sep 01 2014 04:30:00
	 */
	function setHours (dirtyDate, hours) {
	  var date = parse(dirtyDate)
	  date.setHours(hours)
	  return date
	}

	module.exports = setHours


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var parse = __webpack_require__(27)

	/**
	 * @category Minute Helpers
	 * @summary Set the minutes to the given date.
	 *
	 * @description
	 * Set the minutes to the given date.
	 *
	 * @param {Date|String|Number} date - the date to be changed
	 * @param {Number} minutes - the minutes of the new date
	 * @returns {Date} the new date with the minutes setted
	 *
	 * @example
	 * // Set 45 minutes to 1 September 2014 11:30:40:
	 * var result = setMinutes(new Date(2014, 8, 1, 11, 30, 40), 45)
	 * //=> Mon Sep 01 2014 11:45:40
	 */
	function setMinutes (dirtyDate, minutes) {
	  var date = parse(dirtyDate)
	  date.setMinutes(minutes)
	  return date
	}

	module.exports = setMinutes


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var parse = __webpack_require__(27)

	/**
	 * @category Minute Helpers
	 * @summary Return the start of a minute for the given date.
	 *
	 * @description
	 * Return the start of a minute for the given date.
	 * The result will be in the local timezone.
	 *
	 * @param {Date|String|Number} date - the original date
	 * @returns {Date} the start of a minute
	 *
	 * @example
	 * // The start of a minute for 1 December 2014 22:15:45.400:
	 * var result = startOfMinute(new Date(2014, 11, 1, 22, 15, 45, 400))
	 * //=> Mon Dec 01 2014 22:15:00
	 */
	function startOfMinute (dirtyDate) {
	  var date = parse(dirtyDate)
	  date.setSeconds(0, 0)
	  return date
	}

	module.exports = startOfMinute


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var parse = __webpack_require__(27)

	/**
	 * @category Month Helpers
	 * @summary Return the start of a month for the given date.
	 *
	 * @description
	 * Return the start of a month for the given date.
	 * The result will be in the local timezone.
	 *
	 * @param {Date|String|Number} date - the original date
	 * @returns {Date} the start of a month
	 *
	 * @example
	 * // The start of a month for 2 September 2014 11:55:00:
	 * var result = startOfMonth(new Date(2014, 8, 2, 11, 55, 0))
	 * //=> Mon Sep 01 2014 00:00:00
	 */
	function startOfMonth (dirtyDate) {
	  var date = parse(dirtyDate)
	  date.setDate(1)
	  date.setHours(0, 0, 0, 0)
	  return date
	}

	module.exports = startOfMonth


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var parse = __webpack_require__(27)

	/**
	 * @category Week Helpers
	 * @summary Return the start of a week for the given date.
	 *
	 * @description
	 * Return the start of a week for the given date.
	 * The result will be in the local timezone.
	 *
	 * @param {Date|String|Number} date - the original date
	 * @param {Object} [options] - the object with options
	 * @param {Number} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
	 * @returns {Date} the start of a week
	 *
	 * @example
	 * // The start of a week for 2 September 2014 11:55:00:
	 * var result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0))
	 * //=> Sun Aug 31 2014 00:00:00
	 *
	 * @example
	 * // If week starts at Monday, the start of a week for 2 September 2014 11:55:00:
	 * var result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0), {weekStartsOn: 1})
	 * //=> Mon Sep 01 2014 00:00:00
	 */
	function startOfWeek (dirtyDate, options) {
	  var weekStartsOn = options ? (options.weekStartsOn || 0) : 0

	  var date = parse(dirtyDate)
	  var day = date.getDay()
	  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn

	  date.setDate(date.getDate() - diff)
	  date.setHours(0, 0, 0, 0)
	  return date
	}

	module.exports = startOfWeek


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);

	angular
	  .module('mwl.calendar')
	  .factory('calendarTitle', ["moment", "calendarConfig", "calendarHelper", function(moment, calendarConfig, calendarHelper) {

	    function day(viewDate) {
	      return calendarHelper.formatDate(viewDate, calendarConfig.titleFormats.day);
	    }

	    function week(viewDate) {
	      return calendarConfig.titleFormats.week
	        .replace('{week}', moment(viewDate).isoWeek())
	        .replace('{year}', moment(viewDate).startOf('week').format('YYYY'));
	    }

	    function month(viewDate) {
	      return calendarHelper.formatDate(viewDate, calendarConfig.titleFormats.month);
	    }

	    function year(viewDate) {
	      return calendarHelper.formatDate(viewDate, calendarConfig.titleFormats.year);
	    }

	    return {
	      day: day,
	      week: week,
	      month: month,
	      year: year
	    };

	  }]);


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(12);
	var moment = __webpack_require__(53);

	angular
	  .module('mwl.calendar')
	  .constant('moment', moment);


/***/ },
/* 53 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_53__;

/***/ }
/******/ ])
});
;