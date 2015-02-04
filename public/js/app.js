+function(){

  function Beat(){

    this.avgBufferSize = 10;
    this.timeBuffer = null;

    this.getBeatLength = function(){
      var now = new Date().getTime(),
          beatLength;
      if(this.timeBuffer !== null){
        beatLength = now - this.timeBuffer;
        this.timeBuffer = now;
        return beatLength;
      }else{
        this.timeBuffer = now;
        throw 'Beat not yet configured, you should discard this result';
      }
    };

    this.addBeat = function(){
      try{
        this.avgBuffer[this.avgBufferIndex] = this.getBeatLength();
        this.avgBufferIndex = (this.avgBufferIndex + 1) % this.avgBufferSize;
      }catch(exc){
        console.log(exc);
      }
    };

    this.getBpm = function(){
      var i, avg = 0;
      for(i = 0; i < this.avgBuffer.length; i++){
        avg += this.avgBuffer[i];
      }

      avg /= this.avgBuffer.length;

      return 60 * 1000 / avg;
    };
    
    this.reset = function(){
      this.avgBuffer = [];
      this.avgBufferIndex = 0;
    };
    
    this.reset();

  }

  angular.module('beatFinder', [])
    .service('beat', Beat)
    .controller('BeatController', ['$scope', 'beat', function($scope, beat){
      $scope.bpm = 0;
      $scope.updateBpm = function(){
        beat.addBeat();
        $scope.bpm = beat.getBpm();
      };
    }]);
}();
