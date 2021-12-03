<!-- From https://tasmota.github.io/docs/Commands/#control -->
<p>
  Set policies for the beginning of daylight saving time (Dst) and return back to standard time
  (Std)  <br /><code>0</code> = reset parameters to firmware defaults<br /><code>H</code>,<code
    >W</code
  >,<code>M</code>,<code>D</code>,<code>h</code>,<code>T</code><br />
  <code>H</code>
  = hemisphere (<code>0</code> = northern hemisphere / <code>1</code> = southern hemisphere)<br />
  <code>W</code>
  = week (<code>0</code> = last week of month, <code>1..4</code> = first .. fourth)<br />
  <code>M</code>
  = month (<code>1..12</code>)<br /> <code>D</code> = day of week (<code>1..7</code> <code>1</code>
  = sunday <code>7</code> = saturday)<br />
  <code>h</code>
  = hour (<code>0..23</code>)<br /> <code>T</code> = timezone (<code>-780..780</code>) (offset from
  UTC in <strong>MINUTES</strong> - 780min / 60min=13hrs)<br /><em>Example:</em>
  <code>TIMEDST 1,1,10,1,2,660</code><br /><em
    >If timezone is <strong>NOT</strong> 99, DST is not used (even if displayed)</em
  >
  <a href="https://github.com/arendst/Tasmota/issues/8528#issuecomment-633247984">see</a>
</p>
