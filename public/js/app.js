+function(){
  
  function Beat(){
    //Prebuild the buffer to avoid NaNs
    this.buffer = [0, 0];
    this.currentIndex = 0;
    
    this.addBeat = function(){
      this.buffer[this.currentIndex] = new Date().getTime();
      this.currentIndex = (this.currentIndex + 1) % this.buffer.length;
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
      $scope.bpm = 0;
      $scope.updateBpm = function(){
        beat.addBeat();
        //AVG WITH THE OLD VALUE
        $scope.bpm = ($scope.bpm + beat.getBpm()) / 2;
      };
    }]);
}();
