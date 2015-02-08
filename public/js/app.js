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

    this.getAvg = function(){
      var i, avg = 0, bufferSize = this.getBufferSize();
      for(i = 0; i < bufferSize; i++){
        avg += this.avgBuffer[i];
      }

      avg /= bufferSize;
      
      return avg;
    };
    
    this.getBpm = function(){
      return 60 * 1000 / this.getAvg();
    };

    this.reset = function(){
      this.avgBuffer = [];
      this.avgBufferIndex = 0;
      this.timeBuffer = null;
    };
    
    this.reset();

    this.getBufferSize = function(){
      return Math.min(this.avgBufferSize, this.avgBuffer.length);
    };
    
    this.setBufferSize = function(size){
      this.avgBufferSize = size;
      this.reset();
    }
    
    this.getStdDev = function(){
      var i, sqAvg = Math.pow(this.getAvg(), 2), bufferSize = this.getBufferSize(), stdDev = 0;
      for(i = 0; i < bufferSize; i++){
        stdDev += Math.pow(this.avgBuffer[i], 2);
      }

      stdDev /= bufferSize;
      stdDev -= sqAvg;

      stdDev = Math.pow(stdDev, 0.5);

      return stdDev;
    };
    
    this.getBpmStdDev = function(){
      // K = 60000 (ms per minute)
      // A = AVG S = STDDEV C = BPM AVG
      // B = C - K/(A+S);
      // C = K/A;
      // B = K/A - K/(A+S);
      // B = (K(A+S) - KA)/(A(A+S))
      // B = KS/(A(A+S))
      var stdDev = this.getStdDev(),
          avg = this.getAvg();
      return stdDev * 60 * 1000 / (avg * (avg + stdDev));
    };

  }

  angular.module('beatFinder', ['rt.debounce'])
    .service('beat', Beat)
    .controller('BeatController', ['$scope', 'beat', 'debounce', function($scope, beat, debounce){
      var inactivityReset;

      $scope.bpm = 0;
      $scope.buffer = 10;
      $scope.stddev = 0;
      
      $scope.updateBpm = function(){
        beat.addBeat();
        $scope.bpm = beat.getBpm();
        $scope.stddev = beat.getBpmStdDev();
        inactivityReset();
      };

      $scope.$watch('buffer', function(newValue, oldValue){
        beat.setBufferSize(parseInt(newValue));
      });

      $scope.reset = function(){
        beat.reset();
        $scope.updateBpm();
      };

      inactivityReset = debounce(3000, function(){
        $scope.reset();
      });

    }]);
}();
