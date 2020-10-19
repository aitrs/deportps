use strict;
use warnings;
use JSON;

my $ps = qx(ps aux);
my $lc = 0;
my @psa;
my @keys;
my @values;
my $dex = 0;
my $ct = 0;

open my $fh, '<', '/etc/monitor/conf.json' or die "Can't open file $!";
my $file_content = do { local $/; <$fh> };

my $conf = decode_json $file_content;

foreach my $line (split /[\r\n]+/, $ps) {
	if($lc == 0) {
		foreach my $word (split /[ \t]+/, $line) {
			$word =~ s/\%/PC/g;
			push @keys, $word;
			$ct++;
		}
	} else {
		foreach my $word (split /[ \t]+/, $line) {
			my %ha = (
				$keys[$dex] =>$word
			);
			push @psa, \%ha;
			$dex++;
			if($dex >= $ct) {
				last;
			}
		}
		$dex = 0;
	}
	$lc++;
}

my %obj = (
	"machine" => $conf,
	"ps" => \@psa
);

print encode_json \%obj;



