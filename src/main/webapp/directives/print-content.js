(function (angular) {
    'use strict';
    function printDirective() {
        var printSection = document.getElementById('printSection');
        // if there is no printing section, create one
        if (!printSection) {
            printSection = document.createElement('div');
            printSection.id = 'printSection';
            document.body.appendChild(printSection);
        }
        function link(scope, element, attrs) {
            element.on('click', function () {
            	printSection.innerHTML='';
                var elemToPrint = document.getElementById(attrs.printElementId);
                if (elemToPrint) {
                    printElement(elemToPrint);
                }
            });
        }
        function printElement(elem) {
            // clones the element you want to print
            var domClone = elem.cloneNode(true);
            printSection.appendChild(domClone);
            
            window.print();
        }
        return {
            link: link,
            restrict: 'A'
        };
    }
    angular.module('myApp').directive('ngPrint', [printDirective]);
}(window.angular));