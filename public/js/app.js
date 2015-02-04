+function(){
  
  function Beat(){
    this.buffer = [];
    this.currentIndex = 0;
    
    this.addBeat = function(){
      this.buffer[this.currentIndex] = new Date().getTime();
      this.currentIndex = (this.currentIndex + 1) % 2;
    };
    
    this.getBeatLength = function(){
      return Math.abs(this.buffer[1] - this.buffer[0]);
    };
    
    this.getBpm = function(){
      return 60 * 1000 / this.getBeatLength();
    };
    
  }
  
  angular.module('beatFinder', [])
    .service('beat', Beat)
    .controller('BeatController', ['$scope', 'beat', function($scope, beat){
      $scope.bpm = NaN;
      $scope.updateBpm = function(){
        beat.addBeat();
        $scope.bpm = beat.getBpm();
      };
    }]);
}();
